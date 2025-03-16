import StatisticCard from './StatisticCard';

import { FormatNumber, Grid } from '@chakra-ui/react';
import { FaBox, FaMoneyBillWave, FaShoppingCart, FaUser } from 'react-icons/fa';

const StatisticCardGroup = ({ totalUsers, totalRevenue }) => {
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
          <FormatNumber value={totalRevenue.overallTotal} currency="VND" /> VND
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
  );
};

export default StatisticCardGroup;
