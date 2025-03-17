import { useColorModeValue } from '@/components/ui/color-mode';
import { useAuthStore } from '@/store/authStore';
import {
  Box,
  DrawerContent,
  Center,
  Spinner,
  DrawerPositioner,
  DrawerBackdrop,
  Portal,
  DrawerRoot,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MobileNav from '../Layout/MobileNav';
import SidebarContent from '../Layout/SidebarContent';

const MainLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  // Functions to handle drawer state
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    // Save the current path to session storage when navigating
    if (!isLoading && user?.role === 'admin') {
      sessionStorage.setItem('lastPath', location.pathname);
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (user && isAuthenticated && localStorage.getItem('access_token')) {
      // Still verify admin role
      if (user.role !== 'admin') {
        localStorage.removeItem('access_token');
        navigate('/login', { replace: true });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      // Restore the last path after authentication is confirmed
      const lastPath = sessionStorage.getItem('lastPath');
      if (lastPath && lastPath !== '/' && location.pathname === '/') {
        navigate(lastPath, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, user]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="black"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <SidebarContent
        onClose={closeDrawer}
        display={{ base: 'none', md: 'block' }}
      />

      <DrawerRoot
        open={isDrawerOpen}
        onOpenChange={isOpen => setIsDrawerOpen(isOpen)}
        placement="start"
        size={'full'}
      >
        <Portal>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent>
              <SidebarContent onClose={closeDrawer} />
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>

      <MobileNav onOpen={openDrawer} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
