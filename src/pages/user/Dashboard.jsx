import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const tempsRestant = (dateLimite) => {
    if (!dateLimite) return null;
    const diff = new Date(dateLimite) - new Date();
    if (diff <= 0) return 'Expiré';
    const heures = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${heures}h ${minutes}min restantes`;
    };
    const badge = (statut) => {
    const map = {
        en_attente: { color: 'warning', label: 'En attente' },
        acceptee: { color: 'success', label: 'Acceptée' },
        refusee: { color: 'danger', label: 'Refusée' },
        expiree: { color: 'dark', label: 'Expirée' },
    };
    const item = map[statut] || { color: 'secondary', label: statut };
    return <span className={`badge bg-${item.color}`}>{item.label}</span>;
    };

    const fetchReservations = () => {
        api.get('/mes-reservations')
            .then((res) => setReservations(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const payer = async (id) => {
        await api.post(`/reservations/${id}/payer`);
        fetchReservations();
    };

    const telecharger = async (id) => {
        const res = await api.get(`/reservations/${id}/ticket`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ticket-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

   return (
    <>
        <Navbar />
        <div className="page-container">
            <div className="page-header">
                <h2>📋 Mes Réservations</h2>
                <Link to="/dashboard/nouvelle-reservation" className="btn btn-primary">
                    + Nouvelle réservation
                </Link>
            </div>

            {loading ? (
                <div className="loading-wrapper">
                    <div className="spinner-border" role="status"></div>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table mb-0">
                        <thead>
            <tr>
                <th>Terrain</th>
                <th>Date</th>
                <th>Heure début</th>
                <th>Heure fin</th>
                <th>Statut</th>
                <th>Paiement</th>
                <th>Délai</th>
                <th>Actions</th>
            </tr>
            </thead>
                        <tbody>
                            {reservations.map((r) => (
                                <tr key={r.id}>
                                    <td><strong>{r.terrain?.nom}</strong></td>
                                    <td>{r.date}</td>
                                    <td>{r.heure_debut}</td>
                                    <td>{r.heure_fin}</td>
                                    <td>{badge(r.statut)}</td>
                                    <td>
                                        {r.paiement === 'paye' ? (
                                            <span className="badge bg-success">Payé</span>
                                        ) : (
                                            <span className="badge bg-secondary">Non payé</span>
                                        )}
                                    </td>
                                    <td>
                                        {r.statut === 'acceptee' && r.paiement === 'non_paye' && (
                                            <small className="text-danger fw-bold">
                                                ⏳ {tempsRestant(r.date_limite_paiement)}
                                            </small>
                                        )}
                                    </td>
                                    <td>
                                        {r.statut === 'acceptee' && r.paiement === 'non_paye' && (
                                            <button className="btn btn-sm btn-success me-2" onClick={() => payer(r.id)}>
                                                💳 Payer
                                            </button>
                                        )}
                                        {r.paiement === 'paye' && (
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => telecharger(r.id)}>
                                                📄 Ticket
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {reservations.length === 0 && (
                                <tr>
                                    <td colSpan="8">
                                        <div className="empty-state">
                                            <div className="icon">📭</div>
                                            <p>Aucune réservation pour le moment</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </>
);
}