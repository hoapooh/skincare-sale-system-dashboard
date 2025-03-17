import { Route, Routes } from 'react-router-dom';
import routes from './configs/routes';
import NotFound from './features/NotFound/NotFound';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import { Center, Spinner } from '@chakra-ui/react';

function App() {
  const { loadUser, isLoading } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading)
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

  return (
    <>
      <Routes>
        {routes.map((route, i) => {
          const Layout = route.layout;
          return (
            <Route key={i} element={<Layout />}>
              {route.data.map(item => {
                const Component = item.component;
                return (
                  <Route
                    key={item.path}
                    path={item.path}
                    element={<Component />}
                  />
                );
              })}
            </Route>
          );
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
