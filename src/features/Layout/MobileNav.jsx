import { useColorModeValue } from '@/components/ui/color-mode';
import { toaster } from '@/components/ui/toaster';
import { logoutApi } from '@/services/authApi';
import { useAuthStore } from '@/store/authStore';
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
  Box,
  Flex,
  HStack,
  IconButton,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiChevronDown, FiMenu } from 'react-icons/fi';

const MobileNav = ({ onOpen, ...rest }) => {
  const { user, logout } = useAuthStore();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderBottomColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    await logout();
    await logoutApi();
    toaster.success({
      title: 'Logout successful',
    });
  };

  if (!user) return null;

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderBottomColor}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      {/* BURGER MENU */}
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      >
        <FiMenu />
      </IconButton>

      {/* LOGO */}
      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      {/* MENU TRIGGER */}
      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <MenuRoot>
            <MenuTrigger py={2}>
              <HStack>
                <AvatarRoot size={'sm'}>
                  <AvatarImage
                    src={
                      'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                  <AvatarFallback name="Dan Abrahmov" />
                </AvatarRoot>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user.name}</Text>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    textTransform={'capitalize'}
                  >
                    {user.role}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuTrigger>
            <Portal>
              <MenuPositioner>
                <MenuContent>
                  <MenuItem
                    _hover={{
                      bg: 'brown',
                      color: 'white',
                    }}
                    value="profile"
                  >
                    Profile
                  </MenuItem>

                  <MenuSeparator />

                  <MenuItem
                    _hover={{
                      bg: 'brown',
                      color: 'white',
                    }}
                    value="logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </Portal>
          </MenuRoot>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileNav;
