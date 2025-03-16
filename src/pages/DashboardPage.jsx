import { useAuthStore } from '@/store/authStore';

const DashboardPage = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    return <div>{user.email}</div>;
};

export default DashboardPage;
