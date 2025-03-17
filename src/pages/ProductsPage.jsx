import ProductDataTable from '@/features/Product/ProductDataTable';
import { Button, Heading, HStack, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getAllProductsApi } from '@/services/dashboardApi';

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const fetchProducts = async () => {
    const products = await getAllProductsApi();
    setData(products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <Heading size="lg">Product Management</Heading>
        <Button colorPalette="black" onClick={() => setIsModalOpen(true)}>
          Add New Product
        </Button>
      </HStack>

      <ProductDataTable data={data} />
    </VStack>
  );
};

export default ProductsPage;
