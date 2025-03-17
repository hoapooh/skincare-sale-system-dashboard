import { toaster } from '@/components/ui/toaster';
import { banUserApi, getAllUsersApi, unbanUserApi } from '@/services/userApi';
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
  TableScrollArea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
// import { AiFillEdit } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import { IoChevronForward, IoChevronBack } from 'react-icons/io5';
import { MdDelete, MdRestore } from 'react-icons/md';
import UserDrawer from './UserDrawer';
import { format } from 'date-fns';
import { FaEllipsisVertical } from 'react-icons/fa6';

const pageSizeCollection = createListCollection({
  items: [
    {
      value: '5',
      label: '5',
    },
    {
      value: '10',
      label: '10',
    },
    {
      value: '20',
      label: '20',
    },
    {
      value: '50',
      label: '50',
    },
  ],
});

const DataTable = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 1,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false); // Filter state for showing banned/active users

  // Function to fetch users - extracted for reuse
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsersApi(currentPage, pageSize, showDeleted);

      if (response && response.result) {
        setUsers(response.result);
        setMeta(response.meta);
      } else {
        console.error('Invalid response format:', response);
        toaster.create({
          title: 'Error',
          description: 'Received invalid data format from server',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to fetch users',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refresh on dependency changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, showDeleted]);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = value => {
    setPageSize(Number(value.value[0]));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleViewUser = userId => {
    setOpenDrawer(true);
    setSelectedUser(userId);
  };

  /* const handleEditUser = userId => {
        // Implement edit logic
    }; */

  const handleBanUser = async userId => {
    try {
      const confirmBan = window.confirm(
        'Are you sure you want to ban this user?'
      );
      if (!confirmBan) return;

      await banUserApi(userId);

      // Refresh the user list
      await fetchUsers();

      toaster.create({
        title: 'Success',
        description: 'User has been banned successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error banning user:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to ban user',
        type: 'error',
      });
    }
  };

  const handleUnbanUser = async userId => {
    try {
      const confirmUnban = window.confirm(
        'Are you sure you want to unban this user?'
      );
      if (!confirmUnban) return;

      await unbanUserApi(userId);

      // Refresh the user list
      await fetchUsers();

      toaster.create({
        title: 'Success',
        description: 'User has been unbanned successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error unbanning user:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to unban user',
        type: 'error',
      });
    }
  };

  // Handle filter change
  const handleFilterChange = booleanValue => {
    const newValue = booleanValue.value === 'true';
    setShowDeleted(newValue);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <>
      <Heading size="2xl">User Management</Heading>
      {/* User Status Filter */}
      <Box my={4}>
        <TabsRoot
          defaultValue="false"
          variant="enclosed"
          colorScheme={'dark'}
          colorPalette="black"
          onValueChange={handleFilterChange}
        >
          <TabsList bg={'white'} p={1} rounded={'md'}>
            <TabsTrigger
              color={'black'}
              _selected={{ bg: 'black', color: 'white' }}
              value="false"
            >
              Active Users
            </TabsTrigger>
            <TabsTrigger
              color={'black'}
              _selected={{ bg: 'black', color: 'white' }}
              value="true"
            >
              Banned Users
            </TabsTrigger>
          </TabsList>
        </TabsRoot>
      </Box>

      <Box>
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
        ) : (
          <TableScrollArea
            borderWidth={1}
            maxW={'full'}
            overflow={{ base: 'auto', md: 'hidden' }}
          >
            <TableRoot
              colorPalette={'border'}
              showColumnBorder
              interactive
              variant={'line'}
            >
              {/* Table head */}
              <TableHeader>
                <TableRow>
                  <TableColumnHeader>Name</TableColumnHeader>
                  <TableColumnHeader>Email</TableColumnHeader>
                  <TableColumnHeader>Role</TableColumnHeader>
                  <TableColumnHeader>Loyalty Points</TableColumnHeader>
                  <TableColumnHeader>Created At</TableColumnHeader>
                  <TableColumnHeader>Actions</TableColumnHeader>
                </TableRow>
              </TableHeader>

              {/* Table body */}
              <TableBody>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        colorPalette={user.role === 'admin' ? 'red' : 'green'}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.loyaltyPoints}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <MenuRoot positioning={{ placement: 'bottom-end' }}>
                        <MenuTrigger
                          as={Button}
                          size="sm"
                          p={0}
                          colorPalette={'black'}
                          colorScheme={'dark'}
                        >
                          <FaEllipsisVertical />
                        </MenuTrigger>
                        <Portal>
                          <MenuPositioner>
                            <MenuContent>
                              <MenuItem
                                value="view"
                                onClick={() => handleViewUser(user._id)}
                              >
                                <GrView />
                                View
                              </MenuItem>
                              {/* <MenuItem
                                                          value="edit"
                                                          onClick={() =>
                                                              handleEditUser(
                                                                  user._id
                                                              )
                                                          }
                                                      >
                                                          <AiFillEdit />
                                                          Edit
                                                      </MenuItem> */}
                              {!user.isDeleted ? (
                                <MenuItem
                                  value="ban"
                                  onClick={() => handleBanUser(user._id)}
                                  color="red.500"
                                >
                                  <MdDelete />
                                  Ban
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  value="unban"
                                  onClick={() => handleUnbanUser(user._id)}
                                  color="green.500"
                                >
                                  <MdRestore />
                                  Unban
                                </MenuItem>
                              )}
                            </MenuContent>
                          </MenuPositioner>
                        </Portal>
                      </MenuRoot>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableRoot>
          </TableScrollArea>
        )}

        {/* Pagination */}
        {/* <Flex justifyContent="space-between" alignItems="center" mt={4}>
                  <Text>
                      Showing {users.length} out of {meta.total} users
                  </Text>
  
                  <HStack spacing={2}>
                      <IconButton
                          aria-label="Previous page"
                          onClick={() =>
                              handlePageChange(Math.max(1, currentPage - 1))
                          }
                          isDisabled={currentPage === 1}
                          size={'sm'}
                      >
                          <IoChevronBack size={'sm'} />
                      </IconButton>
  
                      {[...Array(meta.pages)].map((_, index) => {
                          const pageNumber = index + 1;
                          return (
                              <Button
                                  key={pageNumber}
                                  size="sm"
                                  colorScheme={
                                      pageNumber === currentPage ? 'blue' : 'gray'
                                  }
                                  onClick={() => handlePageChange(pageNumber)}
                              >
                                  {pageNumber}
                              </Button>
                          );
                      })}
  
                      <IconButton
                          aria-label="Next page"
                          onClick={() =>
                              handlePageChange(
                                  Math.min(meta.pages, currentPage + 1)
                              )
                          }
                          size={'sm'}
                          isDisabled={currentPage === meta.pages}
                      >
                          <IoChevronForward />
                      </IconButton>
                  </HStack>
              </Flex> */}
        <HStack
          flexDir={{ base: 'column', md: 'row' }}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={2}
          mt={4}
        >
          <HStack spacing={2} alignItems="center">
            <Text fontSize={'sm'}>
              Showing{' '}
              {meta.current > 1 ? (meta.current - 1) * meta.pageSize + 1 : 1} -{' '}
              {Math.min(meta.current * meta.pageSize, meta.total)} out of{' '}
              {meta.total} user
              {meta.total !== 1 ? 's' : ''}
            </Text>
          </HStack>

          <Box
            display={'flex'}
            flexDir={{ base: 'column', md: 'row' }}
            alignItems={'center'}
            gap={2}
          >
            <HStack alignItems={'center'} gap={2} minW={'250px'}>
              <Text fontSize={'sm'} mr={2} w={'full'}>
                Rows per page:
              </Text>
              <SelectRoot
                collection={pageSizeCollection}
                size={'sm'}
                defaultValue={['5']}
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

      {selectedUser && (
        <UserDrawer
          open={openDrawer}
          setOpen={setOpenDrawer}
          selecteduser={selectedUser}
        />
      )}
    </>
  );
};

export default DataTable;
