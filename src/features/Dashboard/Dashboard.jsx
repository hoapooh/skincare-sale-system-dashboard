import { Box, Flex, Heading } from '@chakra-ui/react';
import StatisticCardGroup from './StatisticCardGroup';
import RevenueChart from './RevenueChart';
import { useEffect, useState } from 'react';
import { getAllUsersApi } from '@/services/userApi';
import { getOrderTotalApi } from '@/services/orderApi';
import { getAllOrdersApi, getAllProductsApi } from '@/services/dashboardApi';
import RecentOrderList from './RecentOrderList';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchTotalUsers = async () => {
    const users = await getAllUsersApi(1, 5);
    setTotalUsers(users.meta.total);
  };

  const fetchTotalRevenue = async () => {
    const revenue = await getOrderTotalApi();
    setTotalRevenue(revenue);
  };

  const fetchTotalOrders = async () => {
    const orders = await getAllOrdersApi();
    setTotalOrders(orders);
  };

  const fetchTotalProducts = async () => {
    const products = await getAllProductsApi();
    setTotalProducts(products.length);
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalRevenue();
    fetchTotalOrders();
    fetchTotalProducts();
  }, []);

  return (
    <>
      <Heading size={'2xl'}>Dashboard</Heading>

      {/* Statistic Cards */}
      <StatisticCardGroup
        totalUsers={totalUsers}
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        totalProducts={totalProducts}
      />

      <Flex
        w={'full'}
        flexDir={{ base: 'column', lg: 'row' }}
        gap={4}
        justifyContent={'space-between'}
        mt={6}
      >
        {/* Revenue Chart */}
        <Box w={'full'} p={4} bg={'white'} borderRadius={'md'}>
          <Heading size={'lg'}>Overview</Heading>
          <RevenueChart totalRevenue={totalRevenue} />
        </Box>

        {/* Recent Orders */}
        <Box w={'full'} p={4} bg={'white'} borderRadius={'md'}>
          <Heading size={'lg'} mb={4}>
            Recent Orders
          </Heading>
          <RecentOrderList totalOrders={totalOrders} />
        </Box>
      </Flex>
    </>
  );
};

export default Dashboard;
