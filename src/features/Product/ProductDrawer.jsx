import { toaster } from '@/components/ui/toaster';
import { getProductByIdApi } from '@/services/productApi';
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
  Image,
  FormatNumber,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const ProductDrawer = ({ open, setOpen, selectedProduct }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!selectedProduct) return;

      setIsLoading(true);
      try {
        const response = await getProductByIdApi(selectedProduct);
        setProduct(response);
      } catch (error) {
        console.error('Error fetching product:', error);
        toaster.create({
          title: 'Error',
          description: 'Failed to fetch product details',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open && selectedProduct) {
      fetchProduct();
    }
  }, [selectedProduct, open]);

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={e => setOpen(e.open)}
      size={'md'}
      placement={'end'}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Product Details</Drawer.Title>
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
                    color="brown"
                    size="xl"
                  />
                </Center>
              ) : product ? (
                <VStack spacing={6} align="stretch">
                  {/* Product Image */}
                  <Box>
                    <Image
                      src={product.image}
                      alt={product.name}
                      maxH="200px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>

                  {/* Product Header */}
                  <Box>
                    <Heading size="md">{product.name}</Heading>
                    <Badge colorPalette="green" mt={2}>
                      {product.category}
                    </Badge>
                    <HStack mt={2}>
                      <Text fontWeight="bold">Price:</Text>
                      <Text>
                        <FormatNumber value={product.price} currency="VND" />{' '}
                        VND
                      </Text>
                    </HStack>
                  </Box>

                  <Separator />

                  {/* Product Details */}
                  <Box>
                    <Heading size="sm" mb={2}>
                      Product Information
                    </Heading>

                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontWeight="bold">ID</Text>
                        <Text
                          color="gray.600"
                          fontSize="sm"
                          maxW="250px"
                          isTruncated
                        >
                          {product._id}
                        </Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontWeight="bold">Stock</Text>
                        <Text>{product.stock} units</Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontWeight="bold">Product Status</Text>
                        <Badge
                          colorPalette={product.isDeleted ? 'red' : 'green'}
                        >
                          {product.isDeleted ? 'Deleted' : 'Active'}
                        </Badge>
                      </HStack>
                    </VStack>
                  </Box>

                  <Separator />

                  {/* Description */}
                  <Box>
                    <Heading size="sm" mb={2}>
                      Description
                    </Heading>
                    <Text>
                      {product.description || 'No description available'}
                    </Text>
                  </Box>

                  <Separator />

                  {/* Dates */}
                  <Box>
                    <Heading size="sm" mb={2}>
                      Timeline
                    </Heading>

                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontWeight="bold">Created At</Text>
                        <Text>{formatDate(product.createdAt)}</Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontWeight="bold">Last Updated</Text>
                        <Text>{formatDate(product.updatedAt)}</Text>
                      </HStack>

                      {product.deletedAt && (
                        <HStack justify="space-between">
                          <Text fontWeight="bold">Deleted At</Text>
                          <Text>{formatDate(product.deletedAt)}</Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              ) : (
                <Text color="red.500">Product not found</Text>
              )}
            </Drawer.Body>

            <Drawer.Footer>
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

export default ProductDrawer;
