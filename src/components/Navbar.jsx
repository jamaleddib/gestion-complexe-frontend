import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark px-4">
            <Link className="navbar-brand" to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                🏟️ Complexe Sportif
            </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    {user?.role === 'admin' ? (
                        <>
                            <li className="nav-item"><Link className={`nav-link ${isActive('/admin') ? 'active' : ''}`} to="/admin">📊 Dashboard</Link></li>
                            <li className="nav-item"><Link className={`nav-link ${isActive('/admin/terrains') ? 'active' : ''}`} to="/admin/terrains">🏟️ Terrains</Link></li>
                            <li className="nav-item"><Link className={`nav-link ${isActive('/admin/reservations') ? 'active' : ''}`} to="/admin/reservations">📋 Réservations</Link></li>
                            <li className="nav-item"><Link className={`nav-link ${isActive('/admin/clients') ? 'active' : ''}`} to="/admin/clients">👥 Clients</Link></li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item"><Link className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard">📋 Mes Réservations</Link></li>
                            <li className="nav-item"><Link className={`nav-link ${isActive('/dashboard/nouvelle-reservation') ? 'active' : ''}`} to="/dashboard/nouvelle-reservation">➕ Réserver</Link></li>
                        </>
                    )}
                </ul>
                <span className="navbar-text text-white-50 me-3">
                    👤 {user?.name} {user?.prenom}
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    🚪 Déconnexion
                </button>
            </div>
        </nav>
    );
}