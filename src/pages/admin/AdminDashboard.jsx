import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ reservations: 0, enAttente: 0, clients: 0, terrains: 0 });

    useEffect(() => {
        Promise.all([
            api.get('/reservations'),
            api.get('/clients'),
            api.get('/terrains'),
        ]).then(([r, c, t]) => {
            setStats({
                reservations: r.data.length,
                enAttente: r.data.filter((res) => res.statut === 'en_attente').length,
                clients: c.data.length,
                terrains: t.data.length,
            });
        });
    }, []);

    return (
    <>
        <Navbar />
        <div className="page-container">
            <h2 className="mb-4">📊 Tableau de bord Admin</h2>
            <div className="row g-3">
                <div className="col-md-3">
                    <div className="stat-card stat-blue">
                        <h6>Total Réservations</h6>
                        <h2>{stats.reservations}</h2>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card stat-orange">
                        <h6>En attente</h6>
                        <h2>{stats.enAttente}</h2>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card stat-green">
                        <h6>Clients</h6>
                        <h2>{stats.clients}</h2>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card stat-purple">
                        <h6>Terrains</h6>
                        <h2>{stats.terrains}</h2>
                    </div>
                </div>
            </div>
        </div>
    </>
);
}