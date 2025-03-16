import { useAuthStore } from '@/store/authStore';

const DashboardPage = () => {
    const { user } = useAuthStore();

    return <div>{user.email}</div>;
};

export default DashboardPage;
