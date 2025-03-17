import { formatVND } from '@/utils/formatVND';
import { Avatar, Badge, Flex, HStack, Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';

const RecentOrderItem = ({ order }) => {
  console.log(order);

  return (
    <HStack
      w={'full'}
      justifyContent={'space-between'}
      alignItems={'center'}
      pos={'relative'}
    >
      <Flex>
        <Avatar.Root
          size="xl"
          name={order.userId?.name || 'Customer'}
          bg={'black'}
        >
          <Avatar.Fallback color="white">
            {(order.userId?.name || 'Customer').substring(0, 1).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>

        <Flex direction={'column'} ml={4}>
          <Text fontSize={'lg'} color={'black'} fontWeight={'bold'}>
            {order.userId?.name || 'Customer'}
          </Text>
          <Text fontSize={'sm'} color={'gray.500'}>
            {order.userId?.email || 'No email provided'}
          </Text>
        </Flex>
      </Flex>

      <Flex gap={2}>
        <Text fontSize={'lg'}>+{formatVND(order.totalAmount)}</Text>
        <Badge
          fontSize={'sm'}
          size={'sm'}
          colorPalette={'green'}
          pos={'absolute'}
          right={0}
          top={-3}
        >
          {formatDistanceToNow(new Date(order.createdAt), {
            addSuffix: true,
          })}
        </Badge>
      </Flex>
    </HStack>
  );
};

export default RecentOrderItem;
