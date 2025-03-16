import { Route, Routes } from 'react-router-dom';
import routes from './configs/routes';
import NotFound from './features/NotFound/NotFound';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
    const { loadUser } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

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
