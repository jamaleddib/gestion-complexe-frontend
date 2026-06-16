import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalReservation, setModalReservation] = useState(null);
    const [etape, setEtape] = useState('choix'); // 'choix' | 'carte' | 'succes'
    const [error, setError] = useState('');
    const [carteForm, setCarteForm] = useState({
        nom: '',
        numero: '',
        expiration: '',
        cvv: '',
    });
    const [carteLoading, setCarteLoading] = useState(false);

    const fetchReservations = () => {
        api.get('/mes-reservations')
            .then((res) => setReservations(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setReservations((prev) => [...prev]);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const ouvrirModalPaiement = (reservation) => {
        setError('');
        setEtape('choix');
        setCarteForm({ nom: '', numero: '', expiration: '', cvv: '' });
        setModalReservation(reservation);
    };

    const fermerModal = () => {
        setModalReservation(null);
        setError('');
        setEtape('choix');
    };

    const choisirCarte = () => {
        setEtape('carte');
        setError('');
    };

    const handleCarteChange = (e) => {
        let { name, value } = e.target;

        if (name === 'numero') {
            value = value.replace(/\D/g, '').slice(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
        }

        if (name === 'expiration') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 3) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
        }

        if (name === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setCarteForm({ ...carteForm, [name]: value });
    };

    const validerCarte = async (e) => {
        e.preventDefault();
        setError('');

        const numeroNettoye = carteForm.numero.replace(/\s/g, '');
        if (numeroNettoye.length !== 16) {
            setError('Le numéro de carte doit contenir 16 chiffres');
            return;
        }

        const [mois, annee] = carteForm.expiration.split('/');
        const maintenant = new Date();
        const expDate = new Date(`20${annee}`, mois - 1);
        if (!mois || !annee || expDate < maintenant) {
            setError('La date d\'expiration est invalide ou expirée');
            return;
        }

        if (carteForm.cvv.length !== 3) {
            setError('Le CVV doit contenir 3 chiffres');
            return;
        }

        setCarteLoading(true);

        // Simulation d'un délai de traitement bancaire
        setTimeout(async () => {
            try {
                await api.post(`/reservations/${modalReservation.id}/payer`, {
                    mode_paiement: 'carte',
                });
                setEtape('succes');
                fetchReservations();
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors du paiement');
            } finally {
                setCarteLoading(false);
            }
        }, 2000);
    };

    const payerEspeces = async () => {
        try {
            await api.post(`/reservations/${modalReservation.id}/payer`, {
                mode_paiement: 'especes',
            });
            setEtape('succes');
            fetchReservations();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du paiement');
        }
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

    const tempsRestant = (dateLimite) => {
        if (!dateLimite) return null;
        const diff = new Date(dateLimite) - new Date();
        if (diff <= 0) return 'Expiré';
        const heures = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${heures}h ${minutes}min restantes`;
    };

    const getTypeCarteIcon = (numero) => {
        const num = numero.replace(/\s/g, '');
        if (num.startsWith('4')) return '💳 Visa';
        if (num.startsWith('5')) return '💳 Mastercard';
        if (num.startsWith('3')) return '💳 Amex';
        return '💳';
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
                                                <span className="badge bg-success">
                                                    {r.mode_paiement === 'carte' ? '💳 Carte' : '💵 Espèces'}
                                                </span>
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
                                                <button className="btn btn-sm btn-success me-2" onClick={() => ouvrirModalPaiement(r)}>
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

            {/* ===== MODAL PAIEMENT ===== */}
            {modalReservation && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden', border: 'none' }}>

                                {/* ===== ÉTAPE 1 : CHOIX DU MODE ===== */}
                                {etape === 'choix' && (
                                    <>
                                        <div className="modal-header border-0 pb-0" style={{ background: '#f8fafc' }}>
                                            <div>
                                                <h5 className="modal-title fw-bold">Paiement de la réservation</h5>
                                                <small className="text-muted">Choisissez votre mode de paiement</small>
                                            </div>
                                            <button type="button" className="btn-close" onClick={fermerModal}></button>
                                        </div>
                                        <div className="modal-body" style={{ background: '#f8fafc' }}>
                                            {error && <div className="alert alert-danger">{error}</div>}

                                            <div className="card mb-3 border-0" style={{ background: 'white', borderRadius: '12px' }}>
                                                <div className="card-body">
                                                    <p className="mb-1"><strong>🏟️ {modalReservation.terrain?.nom}</strong></p>
                                                    <p className="mb-1 text-muted">📅 {modalReservation.date} &nbsp; ⏰ {modalReservation.heure_debut} → {modalReservation.heure_fin}</p>
                                                    <p className="mb-0 fs-5 fw-bold text-primary">Montant : {modalReservation.terrain?.prix} DH</p>
                                                </div>
                                            </div>

                                            <div className="d-flex gap-3 mt-3">
                                                <button
                                                    className="btn flex-fill py-3 fw-bold"
                                                    style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', color: 'white', borderRadius: '12px', fontSize: '0.95rem' }}
                                                    onClick={choisirCarte}
                                                >
                                                    💳<br />
                                                    <span>Carte bancaire</span><br />
                                                    <small style={{ opacity: 0.8, fontWeight: 'normal' }}>Visa, Mastercard</small>
                                                </button>
                                                <button
                                                    className="btn flex-fill py-3 fw-bold"
                                                    style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', borderRadius: '12px', fontSize: '0.95rem' }}
                                                    onClick={payerEspeces}
                                                >
                                                    💵<br />
                                                    <span>Espèces</span><br />
                                                    <small style={{ opacity: 0.8, fontWeight: 'normal' }}>Paiement sur place</small>
                                                </button>
                                            </div>

                                            <small className="text-muted d-block mt-3 text-center">
                                                🔒 Vos informations sont sécurisées
                                            </small>
                                        </div>
                                    </>
                                )}

                                {/* ===== ÉTAPE 2 : FORMULAIRE CARTE ===== */}
                                {etape === 'carte' && (
                                    <>
                                        <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}>
                                            <div>
                                                <button className="btn btn-link text-white p-0 me-2" onClick={() => setEtape('choix')}>← Retour</button>
                                                <h5 className="modal-title fw-bold text-white d-inline">Paiement par carte</h5>
                                            </div>
                                            <button type="button" className="btn-close btn-close-white" onClick={fermerModal}></button>
                                        </div>

                                        <div className="modal-body p-4">

                                            {/* Carte visuelle */}
                                            <div style={{
                                                background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                                                borderRadius: '16px',
                                                padding: '1.5rem',
                                                color: 'white',
                                                marginBottom: '1.5rem',
                                                minHeight: '160px',
                                                position: 'relative',
                                                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
                                            }}>
                                                <div style={{ fontSize: '1.5rem', marginBottom: '1rem', opacity: 0.8 }}>
                                                    {getTypeCarteIcon(carteForm.numero)}
                                                </div>
                                                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '3px', marginBottom: '1rem' }}>
                                                    {carteForm.numero || '•••• •••• •••• ••••'}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <small style={{ opacity: 0.7 }}>Titulaire</small>
                                                        <div style={{ fontWeight: '600' }}>
                                                            {carteForm.nom || 'NOM PRÉNOM'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <small style={{ opacity: 0.7 }}>Expire</small>
                                                        <div style={{ fontWeight: '600' }}>
                                                            {carteForm.expiration || 'MM/AA'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Formulaire */}
                                            {error && <div className="alert alert-danger">{error}</div>}

                                            <form onSubmit={validerCarte}>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Nom sur la carte</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="nom"
                                                        placeholder="Ex: KARIM ALAMI"
                                                        value={carteForm.nom}
                                                        onChange={handleCarteChange}
                                                        required
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Numéro de carte</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="numero"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={carteForm.numero}
                                                        onChange={handleCarteChange}
                                                        required
                                                        maxLength={19}
                                                        style={{ borderRadius: '8px', fontFamily: 'monospace', letterSpacing: '2px' }}
                                                    />
                                                </div>

                                                <div className="row">
                                                    <div className="col-6 mb-3">
                                                        <label className="form-label fw-semibold">Date d'expiration</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="expiration"
                                                            placeholder="MM/AA"
                                                            value={carteForm.expiration}
                                                            onChange={handleCarteChange}
                                                            required
                                                            maxLength={5}
                                                            style={{ borderRadius: '8px' }}
                                                        />
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <label className="form-label fw-semibold">CVV</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            name="cvv"
                                                            placeholder="•••"
                                                            value={carteForm.cvv}
                                                            onChange={handleCarteChange}
                                                            required
                                                            maxLength={3}
                                                            style={{ borderRadius: '8px' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between p-3 mb-3"
                                                    style={{ background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                                    <span className="text-success fw-bold">Montant à payer</span>
                                                    <span className="fs-5 fw-bold text-success">{modalReservation.terrain?.prix} DH</span>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100 py-3"
                                                    disabled={carteLoading}
                                                    style={{ borderRadius: '10px', fontSize: '1rem' }}
                                                >
                                                    {carteLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            Traitement en cours...
                                                        </>
                                                    ) : (
                                                        '🔒 Payer maintenant'
                                                    )}
                                                </button>

                                                <small className="text-muted d-flex align-items-center justify-content-center gap-1 mt-2">
                                                    🔒 Paiement 100% sécurisé · SSL
                                                </small>
                                            </form>
                                        </div>
                                    </>
                                )}

                                {/* ===== ÉTAPE 3 : SUCCÈS ===== */}
                                {etape === 'succes' && (
                                    <div className="modal-body text-center p-5">
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                                        <h4 className="fw-bold text-success">Paiement confirmé !</h4>
                                        <p className="text-muted">
                                            Votre réservation pour <strong>{modalReservation.terrain?.nom}</strong><br />
                                            le <strong>{modalReservation.date}</strong> de <strong>{modalReservation.heure_debut}</strong> à <strong>{modalReservation.heure_fin}</strong><br />
                                            a été payée avec succès.
                                        </p>
                                        <p className="fw-bold fs-5 text-success">{modalReservation.terrain?.prix} DH</p>
                                        <hr />
                                        <p className="text-muted small">
                                            📄 Vous pouvez maintenant télécharger votre ticket.
                                        </p>
                                        <button className="btn btn-success w-100 mb-2" onClick={fermerModal}>
                                            Fermer
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}