import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center mt-5">Chargement...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export function AdminRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center mt-5">Chargement...</div>;
    }

    if (!user) return <Navigate to="/login" />;

    return user.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" />;
}