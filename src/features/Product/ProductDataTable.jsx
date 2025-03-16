import { toaster } from '@/components/ui/toaster';
import {
  getAllProductsApi,
  deleteProductApi,
  restoreProductApi,
} from '@/services/productApi';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  HStack,
  IconButton,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  Portal,
  Spinner,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  PaginationItems,
  Text,
  TabsRoot,
  TabsList,
  TabsTrigger,
  SelectRoot,
  SelectControl,
  SelectTrigger,
  SelectValueText,
  SelectIndicatorGroup,
  SelectIndicator,
  SelectPositioner,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  createListCollection,
  Heading,
  FormatNumber,
  Image,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GrView } from 'react-icons/gr';
import {
  IoChevronForward,
  IoChevronBack,
  IoChevronDown,
} from 'react-icons/io5';
import { MdDelete, MdRestore, MdEdit } from 'react-icons/md';
import ProductDrawer from './ProductDrawer';
import ProductFormModal from './ProductFormModal';

const pageSizeCollection = createListCollection({
  items: [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ],
});

const ProductDataTable = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 1,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Function to fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getAllProductsApi();

      if (response) {
        // Check if response is an array (direct product list)
        const productArray = Array.isArray(response)
          ? response
          : response.data
            ? response.data
            : [];

        // Filter products based on deleted status
        const filteredProducts = productArray.filter(
          product => product.isDeleted === showDeleted
        );

        setProducts(filteredProducts);

        // Set meta information
        setMeta({
          current: currentPage,
          pageSize: pageSize,
          pages: Math.ceil(filteredProducts.length / pageSize),
          total: filteredProducts.length,
        });
      } else {
        console.error('Invalid response format:', response);
        toaster.create({
          title: 'Error',
          description: 'Received invalid data format from server',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to fetch products',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refresh on dependency changes
  useEffect(() => {
    fetchProducts();
  }, [showDeleted, currentPage, pageSize]);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = value => {
    setPageSize(Number(value.value[0]));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleViewProduct = productId => {
    setOpenDrawer(true);
    setSelectedProduct(productId);
  };

  const handleOpenCreateForm = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setOpenFormModal(true);
  };

  const handleEditProduct = productId => {
    setSelectedProduct(productId);
    setIsEditing(true);
    setOpenFormModal(true);
  };

  const handleDeleteProduct = async productId => {
    try {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this product?'
      );
      if (!confirmDelete) return;

      await deleteProductApi(productId);

      // Refresh the product list
      await fetchProducts();

      toaster.create({
        title: 'Success',
        description: 'Product has been deleted successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to delete product',
        type: 'error',
      });
    }
  };

  const handleRestoreProduct = async productId => {
    try {
      const confirmRestore = window.confirm(
        'Are you sure you want to restore this product?'
      );
      if (!confirmRestore) return;

      await restoreProductApi(productId);

      // Refresh the product list
      await fetchProducts();

      toaster.create({
        title: 'Success',
        description: 'Product has been restored successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error restoring product:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to restore product',
        type: 'error',
      });
    }
  };

  // Handle filter change
  const handleFilterChange = booleanValue => {
    const newValue = booleanValue === 'true';
    setShowDeleted(newValue);
    setCurrentPage(1); // Reset to first page
  };

  // Get the current page of products
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Heading size="2xl">Product Management</Heading>

      {/* Product Status Filter and Add Button */}
      <Box my={4} display="flex" justifyContent="space-between">
        <TabsRoot
          defaultValue="false"
          value={showDeleted ? 'true' : 'false'}
          variant="enclosed"
          colorPalette="black"
          onValueChange={handleFilterChange}
        >
          <TabsList>
            <TabsTrigger value="false">Active Products</TabsTrigger>
            <TabsTrigger value="true">Deleted Products</TabsTrigger>
          </TabsList>
        </TabsRoot>

        <Button
          colorPalette="black"
          onClick={handleOpenCreateForm}
          isDisabled={showDeleted}
        >
          Add New Product
        </Button>
      </Box>

      <Box>
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
          <TableRoot
            colorPalette={'border'}
            showColumnBorder
            interactive
            variant={'line'}
          >
            {/* Table head */}
            <TableHeader>
              <TableRow>
                <TableColumnHeader>Image</TableColumnHeader>
                <TableColumnHeader>Name</TableColumnHeader>
                <TableColumnHeader>Price</TableColumnHeader>
                <TableColumnHeader>Brand</TableColumnHeader>
                <TableColumnHeader>Category</TableColumnHeader>
                <TableColumnHeader>Stock</TableColumnHeader>
                <TableColumnHeader>Actions</TableColumnHeader>
              </TableRow>
            </TableHeader>

            {/* Table body */}
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Box
                        width="50px"
                        height="50px"
                        overflow="hidden"
                        borderRadius="md"
                      >
                        <Image
                          src={product.imageUrl || product.image}
                          alt={product.name}
                          maxH="200px"
                          objectFit="cover"
                          borderRadius="md"
                          fallbackSrc="https://via.placeholder.com/200x150?text=No+Image"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <FormatNumber value={product.price} currency="VND" /> VND
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      <Badge
                        colorPalette="purple"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <MenuRoot>
                        <MenuTrigger
                          as={Button}
                          size="sm"
                          colorPalette={'black'}
                        >
                          Actions
                          <IoChevronDown />
                        </MenuTrigger>
                        <Portal>
                          <MenuPositioner>
                            <MenuContent>
                              <MenuItem
                                value="view"
                                onClick={() => handleViewProduct(product._id)}
                              >
                                <GrView />
                                View
                              </MenuItem>
                              {!showDeleted && (
                                <MenuItem
                                  value="edit"
                                  onClick={() => handleEditProduct(product._id)}
                                >
                                  <MdEdit />
                                  Edit
                                </MenuItem>
                              )}
                              {!product.isDeleted ? (
                                <MenuItem
                                  value="delete"
                                  onClick={() =>
                                    handleDeleteProduct(product._id)
                                  }
                                  color="red.500"
                                >
                                  <MdDelete />
                                  Delete
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  value="restore"
                                  onClick={() =>
                                    handleRestoreProduct(product._id)
                                  }
                                  color="green.500"
                                >
                                  <MdRestore />
                                  Restore
                                </MenuItem>
                              )}
                            </MenuContent>
                          </MenuPositioner>
                        </Portal>
                      </MenuRoot>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} textAlign="center" py={4}>
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableRoot>
        )}

        {/* Pagination */}
        <HStack justifyContent={'space-between'} alignItems={'center'} mt={4}>
          <HStack spacing={2} alignItems="center">
            <Text fontSize={'sm'}>
              Showing{' '}
              {products.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(currentPage * pageSize, meta.total)} out of {meta.total}{' '}
              product
              {meta.total !== 1 ? 's' : ''}
            </Text>
          </HStack>

          <Box display={'flex'} alignItems={'center'} gap={2}>
            <HStack alignItems={'center'} gap={2} minW={'250px'}>
              <Text fontSize={'sm'} mr={2} w={'full'}>
                Rows per page:
              </Text>
              <SelectRoot
                collection={pageSizeCollection}
                size={'sm'}
                defaultValue={['10']}
                onValueChange={handlePageSizeChange}
              >
                <SelectControl>
                  <SelectTrigger>
                    <SelectValueText placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectIndicatorGroup>
                    <SelectIndicator />
                  </SelectIndicatorGroup>
                </SelectControl>
                <Portal>
                  <SelectPositioner>
                    <SelectContent>
                      {pageSizeCollection.items.map(size => (
                        <SelectItem key={size.value} item={size}>
                          {size.label}
                          <SelectItemIndicator />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPositioner>
                </Portal>
              </SelectRoot>
            </HStack>

            <PaginationRoot
              count={meta.total}
              pageSize={meta.pageSize}
              page={meta.current}
              colorPalette={'black'}
            >
              <ButtonGroup variant={'solid'} size={'sm'} wrap={'wrap'}>
                <PaginationPrevTrigger
                  asChild
                  onClick={() =>
                    handlePageChange(Math.max(1, meta.current - 1))
                  }
                >
                  <IconButton>
                    <IoChevronBack />
                  </IconButton>
                </PaginationPrevTrigger>

                <PaginationItems
                  render={page => (
                    <IconButton
                      variant={{
                        base: 'ghost',
                        _selected: 'outline',
                      }}
                      onClick={() => handlePageChange(page.value)}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />

                <PaginationNextTrigger asChild>
                  <IconButton
                    onClick={() =>
                      handlePageChange(Math.min(meta.pages, meta.current + 1))
                    }
                  >
                    <IoChevronForward />
                  </IconButton>
                </PaginationNextTrigger>
              </ButtonGroup>
            </PaginationRoot>
          </Box>
        </HStack>
      </Box>

      {/* Product Drawer for viewing details */}
      {selectedProduct && (
        <ProductDrawer
          open={openDrawer}
          setOpen={setOpenDrawer}
          selectedProduct={selectedProduct}
        />
      )}

      {/* Product Form Modal for creating/editing */}
      <ProductFormModal
        open={openFormModal}
        setOpen={setOpenFormModal}
        productId={selectedProduct}
        isEditing={isEditing}
        onSuccess={fetchProducts}
      />
    </>
  );
};

export default ProductDataTable;
