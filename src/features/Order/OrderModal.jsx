import {
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Select,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useState } from 'react';
import { updateOrderApi } from '@/services/orderApi';
import { Toaster, toaster } from '@/components/ui/toaster';

const OrderModal = ({ isOpen, onClose, order }) => {
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async () => {
    try {
      await updateOrderApi(order._id, { status });
      toaster.create({
        title: 'Success',
        description: 'Order status updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to update order status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <Button position="absolute" right={4} top={4}>
              Close
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>Order Details</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontWeight="bold">Order ID:</Text>
                <Text>{order._id}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Customer ID:</Text>
                <Text>{order.userId}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Total Amount:</Text>
                <Text>{order.totalAmount} VND</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Status:</Text>
                <Badge
                  colorScheme={order.status === 'confirmed' ? 'green' : 'red'}
                >
                  {order.status}
                </Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Created At:</Text>
                <Text>{new Date(order.createdAt).toLocaleString()}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Items:</Text>
                <VStack align="stretch">
                  {order.items.map(item => (
                    <HStack key={item._id} justify="space-between">
                      <Text>{item.productId?.name || 'Unknown Product'}</Text>
                      <Text>Quantity: {item.quantity}</Text>
                      <Text>Price: {item.price} VND</Text>
                    </HStack>
                  ))}
                </VStack>
              </HStack>
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button colorScheme="blue" mr={3} onClick={handleStatusChange}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default OrderModal;
