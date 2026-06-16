import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';


export default function NouvelleReservation() {
    const [terrains, setTerrains] = useState([]);
    const [form, setForm] = useState({ id_terrain: '', date: '', heure_debut: '', heure_fin: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/terrains').then((res) => setTerrains(res.data));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/reservations', form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la réservation');
        } finally {
            setLoading(false);
        }
    };

    return (
    <>
        <Navbar />
        <div className="page-container">
            <h2 className="mb-4">➕ Nouvelle Réservation</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: '500px' }}>
                <div className="mb-3">
                    <label className="form-label">Terrain</label>
                    <select name="id_terrain" className="form-select" onChange={handleChange} value={form.id_terrain} required>
                        <option value="">-- Choisir un terrain --</option>
                        {terrains.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nom} - {t.prix} DH {t.type ? `(${t.type})` : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" name="date" className="form-control" onChange={handleChange} required />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Heure début</label>
                        <input type="time" name="heure_debut" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Heure fin</label>
                        <input type="time" name="heure_fin" className="form-control" onChange={handleChange} required />
                    </div>
                </div>
                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Réservation...' : '✅ Réserver'}
                </button>
            </form>
        </div>
    </>
);
}