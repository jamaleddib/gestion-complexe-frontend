import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider} from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/user/Dashboard';
import NouvelleReservation from './pages/user/NouvelleReservation';
import AdminDashboard from './pages/admin/AdminDashboard';
import Terrains from './pages/admin/Terrains';
import Reservations from './pages/admin/Reservations';
import Clients from './pages/admin/Clients';
import LandingPage from './pages/LandingPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/nouvelle-reservation" element={<NouvelleReservation />} />
            </Route>

            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/terrains" element={<Terrains />} />
                <Route path="/admin/reservations" element={<Reservations />} />
                <Route path="/admin/clients" element={<Clients />} />
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}