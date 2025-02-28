import HomePage from '@/pages/HomePage';
import MainLayout from '@/components/Layouts/MainLayout';

const routes = [
    {
        layout: MainLayout,
        data: [
            {
                path: '/',
                component: HomePage,
                title: 'Home',
            },
        ],
    },
];

export default routes;
