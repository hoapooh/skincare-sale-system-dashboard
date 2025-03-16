import { toaster } from '@/components/ui/toaster';
import { getUserByIdApi } from '@/services/userApi';
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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const UserDrawer = ({ open, setOpen, selecteduser }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!selecteduser) return;

      setIsLoading(true);
      try {
        const response = await getUserByIdApi(selecteduser);
        setUser(response);
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

    if (open && selecteduser) {
      fetchUser();
    }
  }, [selecteduser, open]);

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
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
            <Drawer.Header>
              <Drawer.Title>User Details</Drawer.Title>
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
              ) : user ? (
                <VStack spacing={6} align="stretch">
                  {/* User Profile Header */}
                  <Flex align="center">
                    <Avatar.Root size="xl" name={user.name} bg={'black'}>
                      <Avatar.Fallback color={'white'}>
                        {user.name?.substring(0, 2).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Box ml={4}>
                      <Heading size="md">{user.name}</Heading>
                      <Text color="gray.500">{user.email}</Text>
                      <Badge
                        colorPalette={user.role === 'admin' ? 'red' : 'green'}
                        mt={2}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {user.role}
                      </Badge>
                    </Box>
                  </Flex>

                  <Separator />

                  {/* User Details */}
                  <Box>
                    <Heading size="sm" mb={2}>
                      Account Information
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
                          {user._id}
                        </Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontWeight="bold">Loyalty Points</Text>
                        <Text>{user.loyaltyPoints}</Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontWeight="bold">Account Status</Text>
                        <Badge colorPalette={user.isDeleted ? 'red' : 'green'}>
                          {user.isDeleted ? 'Banned' : 'Active'}
                        </Badge>
                      </HStack>
                    </VStack>
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
                        <Text>{formatDate(user.createdAt)}</Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text fontWeight="bold">Last Updated</Text>
                        <Text>{formatDate(user.updatedAt)}</Text>
                      </HStack>

                      {user.deletedAt && (
                        <HStack justify="space-between">
                          <Text fontWeight="bold">Deleted At</Text>
                          <Text>{formatDate(user.deletedAt)}</Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>

                  {/* Order History */}
                  <Box>
                    <Heading size="sm" mb={2}>
                      Order History
                    </Heading>
                    {user.orderHistory && user.orderHistory.length > 0 ? (
                      <Text>Has {user.orderHistory.length} orders</Text>
                    ) : (
                      <Text color="gray.500">No order history available</Text>
                    )}
                  </Box>
                </VStack>
              ) : (
                <Text color="red.500">User not found</Text>
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

export default UserDrawer;
