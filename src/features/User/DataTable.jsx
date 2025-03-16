import { toaster } from '@/components/ui/toaster';
import { getAllUsersApi } from '@/services/userApi';
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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import {
    IoChevronForward,
    IoChevronBack,
    IoChevronDown,
} from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import UserDrawer from './UserDrawer';

const DataTable = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 1,
        total: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await getAllUsersApi(currentPage, pageSize);
                setUsers(response.result);
                setMeta(response.meta);
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

        fetchUsers();
    }, [currentPage, pageSize]);

    const handlePageChange = newPage => {
        setCurrentPage(newPage);
    };

    const handleViewUser = userId => {
        setOpenDrawer(true);
        setSelectedUser(userId);
        console.log(`Viewing user with ID: ${userId}`);
    };

    const handleEditUser = userId => {
        console.log(`Editing user with ID: ${userId}`);
        // Implement edit logic
    };

    const handleDeleteUser = userId => {
        console.log(`Deleting user with ID: ${userId}`);
        // Implement delete logic
    };

    const formatDate = dateString => {
        return new Date(dateString).toLocaleString();
    };

    if (isLoading) {
        return (
            <Center h="300px">
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="brown"
                    size="xl"
                />
            </Center>
        );
    }

    return (
        <>
            <Box>
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
                            <TableColumnHeader>
                                Loyalty Points
                            </TableColumnHeader>
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
                                        colorPalette={
                                            user.role === 'admin'
                                                ? 'red'
                                                : 'green'
                                        }
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.loyaltyPoints}</TableCell>
                                <TableCell>
                                    {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <MenuRoot>
                                        <MenuTrigger
                                            as={Button}
                                            size="sm"
                                            colorScheme="blue"
                                        >
                                            Actions
                                            <IoChevronDown />
                                        </MenuTrigger>
                                        <Portal>
                                            <MenuPositioner>
                                                <MenuContent>
                                                    <MenuItem
                                                        value="view"
                                                        onClick={() =>
                                                            handleViewUser(
                                                                user._id
                                                            )
                                                        }
                                                    >
                                                        <GrView />
                                                        View
                                                    </MenuItem>
                                                    <MenuItem
                                                        value="edit"
                                                        onClick={() =>
                                                            handleEditUser(
                                                                user._id
                                                            )
                                                        }
                                                    >
                                                        <AiFillEdit />
                                                        Edit
                                                    </MenuItem>
                                                    <MenuItem
                                                        value="delete"
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user._id
                                                            )
                                                        }
                                                        color="red.500"
                                                    >
                                                        <MdDelete />
                                                        Delete
                                                    </MenuItem>
                                                </MenuContent>
                                            </MenuPositioner>
                                        </Portal>
                                    </MenuRoot>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableRoot>

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
                <HStack justifyContent={'flex-end'}>
                    <PaginationRoot
                        mt={4}
                        count={meta.total}
                        pageSize={meta.pageSize}
                        page={meta.current}
                        colorPalette={'black'}
                    >
                        <ButtonGroup
                            variant={'solid'}
                            size={'sm'}
                            wrap={'wrap'}
                        >
                            <PaginationPrevTrigger
                                asChild
                                onClick={() =>
                                    handlePageChange(
                                        Math.max(1, meta.current - 1)
                                    )
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
                                    >
                                        {page.value}
                                    </IconButton>
                                )}
                            />

                            <PaginationNextTrigger asChild>
                                <IconButton
                                    onClick={() =>
                                        handlePageChange(
                                            Math.min(
                                                meta.pages,
                                                meta.current + 1
                                            )
                                        )
                                    }
                                >
                                    <IoChevronForward />
                                </IconButton>
                            </PaginationNextTrigger>
                        </ButtonGroup>
                    </PaginationRoot>
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
