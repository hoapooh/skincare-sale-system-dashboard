import { Box, Heading } from '@chakra-ui/react';
import StatisticCardGroup from './StatisticCardGroup';
import RevenueChart from './RevenueChart';
import { useEffect, useState } from 'react';
import { getAllUsersApi } from '@/services/userApi';
import { getOrderTotalApi } from '@/services/orderApi';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchTotalUsers = async () => {
    const users = await getAllUsersApi(1, 5);
    setTotalUsers(users.meta.total);
  };

  const fetchTotalRevenue = async () => {
    const revenue = await getOrderTotalApi();
    setTotalRevenue(revenue);
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalRevenue();
  }, []);

  return (
    <>
      <Heading size={'2xl'}>Dashboard</Heading>

      {/* Statistic Cards */}
      <StatisticCardGroup totalUsers={totalUsers} totalRevenue={totalRevenue} />

      {/* Revenue Chart */}
      <Box w={'full'} mt={6} p={2} bg={'white'} borderRadius={'md'}>
        <RevenueChart totalRevenue={totalRevenue} />
      </Box>
    </>
  );
};

export default Dashboard;
