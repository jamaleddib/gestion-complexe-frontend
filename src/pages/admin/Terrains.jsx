import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

export default function Terrains() {
    const [terrains, setTerrains] = useState([]);
    const [form, setForm] = useState({ nom: '', prix: '', type: '', photo: null });
    const [loading, setLoading] = useState(false);

    const fetchTerrains = () => api.get('/terrains').then((res) => setTerrains(res.data));

    useEffect(() => {
        fetchTerrains();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'photo') {
            setForm({ ...form, photo: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (val !== null && val !== '') data.append(key, val);
        });

        try {
            await api.post('/terrains', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm({ nom: '', prix: '', type: '', photo: null });
            document.getElementById('photoInput').value = '';
            fetchTerrains();
        } finally {
            setLoading(false);
        }
    };

    const supprimer = async (id) => {
        if (window.confirm('Supprimer ce terrain ?')) {
            await api.delete(`/terrains/${id}`);
            fetchTerrains();
        }
    };

    return (
    <>
        <Navbar />
        <div className="page-container">
            <h2 className="mb-4">🏟️ Gestion des Terrains</h2>

            <form onSubmit={handleSubmit} className="form-card mb-4">
                <div className="row g-2">
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Nom" value={form.nom} name="nom" onChange={handleChange} required />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control" placeholder="Prix" value={form.prix} name="prix" onChange={handleChange} required />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Type" value={form.type} name="type" onChange={handleChange} />
                    </div>
                    <div className="col-md-2">
                        <input id="photoInput" type="file" className="form-control" name="photo" onChange={handleChange} />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" disabled={loading}>
                            {loading ? '...' : '+ Ajouter'}
                        </button>
                    </div>
                </div>
            </form>

            <div className="row g-3">
                {terrains.map((t) => (
                    <div className="col-md-4" key={t.id}>
                        <div className="card">
                            {t.photo && (
                                <img src={`http://127.0.0.1:8000/storage/${t.photo}`} className="card-img-top" alt={t.nom} />
                            )}
                            <div className="card-body">
                                <h5>{t.nom}</h5>
                                <p className="mb-2 text-primary fw-bold">{t.prix} DH</p>
                                {t.type && <span className="badge bg-secondary mb-2">{t.type}</span>}
                                <div>
                                    <button className="btn btn-sm btn-danger mt-2" onClick={() => supprimer(t.id)}>
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {terrains.length === 0 && (
                    <div className="empty-state">
                        <div className="icon">🏟️</div>
                        <p>Aucun terrain pour le moment</p>
                    </div>
                )}
            </div>
        </div>
    </>
);
}