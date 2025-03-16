import { VStack } from '@chakra-ui/react';
import RecentOrderItem from './RecentOrderItem';

const RecentOrderList = ({ totalOrders }) => {
  return (
    <VStack w={'full'} gap={3}>
      {totalOrders?.slice(0, 6).map(order => (
        <RecentOrderItem key={order._id} order={order} />
      ))}
    </VStack>
  );
};

export default RecentOrderList;
