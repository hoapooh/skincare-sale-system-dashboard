import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const RevenueChart = ({ totalRevenue }) => {
  // Format data for chart display
  const formattedData =
    totalRevenue?.monthlyTotals?.map(item => {
      // Format date as MM-YYYY
      const month = String(item._id.month).padStart(2, '0');
      const year = item._id.year;
      const formattedDate = `${month}-${year}`;

      return {
        name: formattedDate,
        revenue: item.totalAmount,
      };
    }) || [];

  // Enhanced formatter for currency values with appropriate scaling
  const formatVND = value => {
    if (value === 0) return '0';

    // Define suffixes for different scales
    const suffixes = ['', 'K', 'M', 'B', 'T'];

    // Determine the appropriate suffix
    const tier = (Math.log10(Math.abs(value)) / 3) | 0;

    // If the number is less than 1000, show it without abbreviation
    if (tier === 0)
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Calculate the scaled value
    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = value / scale;

    // Format to 1 decimal place when needed, otherwise show as integer
    const formatted = scaled % 1 !== 0 ? scaled.toFixed(1) : scaled.toString();

    // Add commas as thousands separators and append the suffix
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
  };

  // Custom tooltip to display formatted currency values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <p>
            <strong>{label}</strong>
          </p>
          <p style={{ color: '#000', fontWeight: 'normal' }}>
            Revenue: {formatVND(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer
      width={'100%'}
      height={400}
      style={{ marginInline: 'auto' }}
    >
      <BarChart data={formattedData} margin={{ top: 20, right: 30, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          /* label={{
            value: 'Month-Year',
            position: 'insideBottom',
            offset: -10,
          }} */
        />
        <YAxis
          tickFormatter={formatVND}
          /* label={{
            value: 'Revenue (VND)',
            angle: -90,
            position: 'insideLeft',
          }} */
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Bar
          name="Monthly Revenue"
          dataKey="revenue"
          fill="black"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
