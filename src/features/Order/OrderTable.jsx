import { Table, Button, Box, Badge } from '@chakra-ui/react';
import { useState } from 'react';
import OrderModal from './OrderModal';

const OrderTable = ({ data }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewOrder = order => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <Box>
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Order ID</Table.ColumnHeader>
            <Table.ColumnHeader>Customer ID</Table.ColumnHeader>
            <Table.ColumnHeader>Total Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Created At</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(order => (
            <Table.Row key={order._id}>
              <Table.Cell>{order._id}</Table.Cell>
              <Table.Cell>{order.userId}</Table.Cell>
              <Table.Cell>{order.totalAmount} VND</Table.Cell>
              <Table.Cell>
                <Badge
                  colorScheme={order.status === 'confirmed' ? 'green' : 'red'}
                >
                  {order.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                {new Date(order.createdAt).toLocaleString()}
              </Table.Cell>
              <Table.Cell>
                <Button size="sm" onClick={() => handleViewOrder(order)}>
                  View Details
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {selectedOrder && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
        />
      )}
    </Box>
  );
};

export default OrderTable;
