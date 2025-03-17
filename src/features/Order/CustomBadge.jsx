import { Badge } from '@chakra-ui/react';

const CustomBadge = props => {
  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'blue';
      case 'shipped':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get status display text (capitalize first letter)
  const getStatusText = status => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Return the badge component
  return (
    <Badge
      colorPalette={getStatusColor(props.value)}
      borderRadius="full"
      px="2"
      py="1"
      fontSize="0.8em"
      fontWeight="bold"
    >
      {getStatusText(props.value)}
    </Badge>
  );
};

export default CustomBadge;
