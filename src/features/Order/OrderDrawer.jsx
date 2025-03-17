import { toaster } from '@/components/ui/toaster';
import { getOrderByIdApi } from '@/services/orderApi';
import { formatVND } from '@/utils/formatVND';
import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  Heading,
  VStack,
  HStack,
  Text,
  Separator,
  Box,
  Badge,
  Spinner,
  Center,
  Flex,
  Avatar,
  TableRoot,
  TableHeader,
  TableRow,
  TableColumnHeader,
  TableBody,
  TableCell,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { MdPhone, MdLocationOn, MdPayment } from 'react-icons/md';

const OrderDrawer = ({ open, setOpen, selectedOrder }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!selectedOrder) return;

      setIsLoading(true);
      try {
        const response = await getOrderByIdApi(selectedOrder);
        setOrder(response);
      } catch (error) {
        console.error('Error fetching user:', error);
        toaster.create({
          title: 'Error',
          description: 'Failed to fetch user details',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open && selectedOrder) {
      fetchOrder();
    }
  }, [selectedOrder, open]);

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
  };

  // Get the appropriate status color
  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
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

  return (
    <Drawer.Root
      open={open}
      onOpenChange={e => setOpen(e.open)}
      size={{ base: 'full', md: 'md' }}
      placement={'end'}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>Order Details</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton position="absolute" right={4} top={4} />
              </Drawer.CloseTrigger>
            </Drawer.Header>

            <Drawer.Body>
              {isLoading ? (
                <Center h="300px">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="black"
                    size="xl"
                  />
                </Center>
              ) : order ? (
                <VStack spacing={6} align="stretch">
                  {/* Order ID and Status */}
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Text color="gray.500">Order ID:</Text>
                      <Text fontWeight="bold" fontSize="md">
                        {order._id}
                      </Text>
                    </Box>
                    <Badge
                      colorPalette={getStatusColor(order.status)}
                      size="lg"
                      px={3}
                      py={1}
                      borderRadius="md"
                    >
                      {order.status?.toUpperCase()}
                    </Badge>
                  </Flex>

                  <Separator />

                  {/* Customer Information */}
                  <Box>
                    <Heading size="sm" mb={3}>
                      Customer Information
                    </Heading>
                    <Flex alignItems="center" mb={3}>
                      <Avatar.Root
                        size="md"
                        name={order.userId?.name}
                        bg={'black'}
                      >
                        <Avatar.Fallback color={'white'}>
                          {order.userId?.name?.substring(0, 2).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Box ml={3}>
                        <Text fontWeight="bold">{order.userId?.name}</Text>
                        <Text color="gray.500">{order.userId?.email}</Text>
                      </Box>
                    </Flex>

                    <VStack spacing={2} align="stretch" pl={1}>
                      <HStack>
                        <MdPhone />
                        <Text>{order.phoneNumber}</Text>
                      </HStack>
                      <HStack alignItems="flex-start">
                        <MdLocationOn style={{ marginTop: '4px' }} />
                        <Text>{order.address}</Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <Separator />

                  {/* Order Items */}
                  <Box>
                    <Heading size="sm" mb={3}>
                      Order Items
                    </Heading>
                    <TableRoot
                      variant="simple"
                      borderWidth={1}
                      borderRadius="md"
                      overflow="hidden"
                    >
                      <TableHeader bg="gray.50">
                        <TableRow>
                          <TableColumnHeader>Product</TableColumnHeader>
                          <TableColumnHeader isNumeric>
                            Quantity
                          </TableColumnHeader>
                          <TableColumnHeader isNumeric>Price</TableColumnHeader>
                          <TableColumnHeader isNumeric>Total</TableColumnHeader>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map(item => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <HStack>
                                <Box
                                  w="40px"
                                  h="40px"
                                  bg="gray.100"
                                  borderRadius="md"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  {/* You can add a product image here if available */}
                                  <Text fontSize="xs" fontWeight="bold">
                                    {item.productId?.name
                                      ?.substring(0, 2)
                                      .toUpperCase()}
                                  </Text>
                                </Box>
                                <Text fontWeight="medium">
                                  {item.productId?.name}
                                </Text>
                              </HStack>
                            </TableCell>
                            <TableCell isNumeric>{item.quantity}</TableCell>
                            <TableCell isNumeric>
                              {formatVND(item.price)}
                            </TableCell>
                            <TableCell isNumeric fontWeight="bold">
                              {formatVND(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </TableRoot>
                  </Box>

                  {/* Order Summary */}
                  <Box>
                    <Flex
                      justifyContent="space-between"
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      fontWeight="bold"
                    >
                      <Text>Total Amount:</Text>
                      <Text>{formatVND(order.totalAmount)} VND</Text>
                    </Flex>
                  </Box>

                  {/* Payment Information */}
                  <Box>
                    <Heading size="sm" mb={3}>
                      Payment Information
                    </Heading>
                    <HStack>
                      <MdPayment />
                      <Text>Payment ID: {order.paymentId}</Text>
                    </HStack>
                  </Box>

                  <Separator />

                  {/* Order Timeline */}
                  <Box>
                    <Heading size="sm" mb={2}>
                      Order Timeline
                    </Heading>
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Created At</Text>
                        <Text>{formatDate(order.createdAt)}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Updated At</Text>
                        <Text>{formatDate(order.updatedAt)}</Text>
                      </HStack>
                      {order.deletedAt && (
                        <HStack justify="space-between">
                          <Text fontWeight="bold">Cancelled At</Text>
                          <Text>{formatDate(order.deletedAt)}</Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              ) : (
                <Text color="red.500">Order not found</Text>
              )}
            </Drawer.Body>

            <Drawer.Footer borderTopWidth="1px">
              <Button onClick={() => setOpen(false)} variant="outline">
                Close
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default OrderDrawer;
