import { useEffect, useState } from 'react';
import { getAllOrdersApi } from '@/services/orderApi';
import OrderTable from '@/features/Order/OrderTable';
import { Box, Heading, Spinner, Center } from '@chakra-ui/react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getAllOrdersApi();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box>
      <Heading size="2xl" mb={4}>
        Order Management
      </Heading>
      {isLoading ? (
        <Center h="300px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brown"
            size="xl"
          />
        </Center>
      ) : (
        <OrderTable data={orders} onOrderUpdated={fetchOrders} />
      )}
    </Box>
  );
};

export default OrderPage;
