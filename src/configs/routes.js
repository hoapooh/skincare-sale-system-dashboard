import AuthLayout from '@/features/Auth/AuthLayout';
import MainLayout from '@/features/Dashboard/MainLayout';
import BlogDetailPage from '@/pages/BlogDetailPage';
import BlogPage from '@/pages/BlogPage';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import OrdersPage from '@/pages/OrdersPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ProductsPage from '@/pages/ProductsPage';
import UsersPage from '@/pages/UsersPage';

const routes = [
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        component: DashboardPage,
        title: 'Admin | Dashboard',
      },
      {
        path: '/users',
        component: UsersPage,
        title: 'Admin | Users',
      },
      {
        path: '/products',
        component: ProductsPage,
        title: 'Admin | Products',
      },
      {
        path: '/orders',
        component: OrdersPage,
        title: 'Admin | Orders',
      },
      {
        path: 'product/:id',
        component: ProductDetailPage,
        title: 'Admin | Product Details',
      },
      {
        path: '/blogs',
        component: BlogPage,
        title: 'Admin | Blogs',
      },
      {
        path: '/blogs/:id',
        component: BlogDetailPage,
        title: 'Admin | Blog Details',
      },
    ],
  },
  {
    layout: AuthLayout,
    data: [
      {
        path: '/login',
        component: LoginPage,
        title: 'Admin | Login',
      },
    ],
  },
];

export default routes;
