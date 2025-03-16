import { Box, Text } from '@chakra-ui/react';

const StatisticCard = ({ title, value, icon }) => {
  return (
    <Box
      borderRadius={'md'}
      bg={'white'}
      p={5}
      border={'1px solid'}
      borderColor={'black'}
      cursor={'default'}
      pos={'relative'}
      color={'black'}
    >
      {icon}
      <Text fontSize={'sm'}>{title}</Text>

      <Text fontSize={'xl'} fontWeight={'bold'}>
        {value}
      </Text>
    </Box>
  );
};

export default StatisticCard;
