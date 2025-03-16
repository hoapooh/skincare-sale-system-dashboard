import { FormatNumber, Grid, Heading } from '@chakra-ui/react';
import StatisticCard from '../User/StatisticCard';
import { useEffect, useState } from 'react';
import { getAllUsersApi } from '@/services/userApi';
import { FaBox, FaMoneyBillWave, FaShoppingCart, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchTotalUsers = async () => {
    const users = await getAllUsersApi(1, 5);
    setTotalUsers(users.meta.total);
  };

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  const statisticsInfo = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: (
        <FaUser
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            color: 'black',
          }}
        />
      ),
    },
    {
      title: 'Total Revenue',
      value: (
        <>
          <FormatNumber value={1000000} currency="VND" /> VND
        </>
      ),
      icon: (
        <FaMoneyBillWave
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            color: 'black',
          }}
        />
      ),
    },
    {
      title: 'Total Orders',
      value: 100,
      icon: (
        <FaShoppingCart
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            color: 'black',
          }}
        />
      ),
    },
    {
      title: 'Total Products',
      value: 1000,
      icon: (
        <FaBox
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            color: 'black',
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Heading size={'2xl'}>Dashboard</Heading>

      <Grid templateColumns={'repeat(4, 1fr)'} gap={10} mt={4}>
        {statisticsInfo.map(statistic => (
          <StatisticCard
            key={statistic.title}
            title={statistic.title}
            value={statistic.value}
            icon={statistic.icon}
          />
        ))}
      </Grid>
    </>
  );
};

export default Dashboard;
