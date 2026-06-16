import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = () => {
        api.get('/reservations')
            .then((res) => setReservations(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const updateStatut = async (id, statut) => {
        await api.put(`/reservations/${id}/statut`, { statut });
        fetchReservations();
    };

    const badge = (statut) => {
        const map = {
            en_attente: { color: 'warning', label: 'En attente' },
            acceptee: { color: 'success', label: 'Acceptée' },
            refusee: { color: 'danger', label: 'Refusée' },
        };
        const item = map[statut] || { color: 'secondary', label: statut };
        return <span className={`badge bg-${item.color}`}>{item.label}</span>;
    };

    return (
    <>
        <Navbar />
        <div className="page-container">
            <h2 className="mb-4"> Gestion des Réservations</h2>

            {loading ? (
                <div className="loading-wrapper">
                    <div className="spinner-border"></div>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Email</th>
                                <th>Terrain</th>
                                <th>Date</th>
                                <th>Heure début</th>
                                <th>Heure fin</th>
                                <th>Statut</th>
                                <th>Paiement</th>
                                <th> Type de Paiement</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((r) => (
                                <tr key={r.id}>
                                    <td><strong>{r.client?.name} {r.client?.prenom}</strong></td>
                                    <td>{r.client?.email}</td>
                                    <td>{r.terrain?.nom}</td>
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
                                    <td>{r.paiement === 'paye' ? (<span className="badge bg-success"> Payé ({r.mode_paiement === 'carte' ? ' Carte' : ' Espèces'})</span> ) : (<span className="badge bg-secondary">Non payé</span>)}
                                    </td>
                                    <td>
                                        {r.statut === 'en_attente' && (
                                            <>
                                                <button className="btn btn-sm btn-success me-2" onClick={() => updateStatut(r.id, 'acceptee')}>
                                                    Accepter
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => updateStatut(r.id, 'refusee')}>
                                                    Refuser
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {reservations.length === 0 && (
                                <tr>
                                    <td colSpan="9">
                                        <div className="empty-state">
                                            <div className="icon"></div>
                                            <p>Aucune réservation</p>
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