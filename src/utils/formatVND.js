// Enhanced formatter for currency values with appropriate scaling
export const formatVND = value => {
  if (value === 0) return '0';

  // Define suffixes for different scales
  const suffixes = ['', 'K', 'M', 'B', 'T'];

  // Determine the appropriate suffix
  const tier = (Math.log10(Math.abs(value)) / 3) | 0;

  // If the number is less than 1000, show it without abbreviation
  if (tier === 0) return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Calculate the scaled value
  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;

  // Format to 1 decimal place when needed, otherwise show as integer
  const formatted = scaled % 1 !== 0 ? scaled.toFixed(1) : scaled.toString();

  // Add commas as thousands separators and append the suffix
  return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
};
