import { useAuthStore } from '@/store/authStore';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role === 'admin' &&
      localStorage.getItem('access_token')
    ) {
      // Redirect to the last visited path or dashboard if none exists
      const lastPath = sessionStorage.getItem('lastPath');
      navigate(lastPath || '/', { replace: true });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, user]);

  if (loading) {
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
    <Box>
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
