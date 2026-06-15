import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: '', prenom: '', email: '' });
    const [loading, setLoading] = useState(true);

    const fetchClients = () => {
        api.get('/clients')
            .then((res) => setClients(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const startEdit = (c) => {
        setEditId(c.id);
        setForm({ name: c.name, prenom: c.prenom, email: c.email });
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const save = async () => {
        await api.put(`/clients/${editId}`, form);
        setEditId(null);
        fetchClients();
    };

    const supprimer = async (id) => {
        if (window.confirm('Supprimer ce client ?')) {
            await api.delete(`/clients/${id}`);
            fetchClients();
        }
    };

    return (
    <>
        <Navbar />
        <div className="page-container">
            <h2 className="mb-4">👥 Gestion des Clients</h2>

            {loading ? (
                <div className="loading-wrapper">
                    <div className="spinner-border"></div>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((c) => (
                                <tr key={c.id}>
                                    {editId === c.id ? (
                                        <>
                                            <td><input className="form-control" name="name" value={form.name} onChange={handleChange} /></td>
                                            <td><input className="form-control" name="prenom" value={form.prenom} onChange={handleChange} /></td>
                                            <td><input className="form-control" name="email" value={form.email} onChange={handleChange} /></td>
                                            <td>
                                                <button className="btn btn-sm btn-success me-2" onClick={save}>✓ Enregistrer</button>
                                                <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>Annuler</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td><strong>{c.name}</strong></td>
                                            <td>{c.prenom}</td>
                                            <td>{c.email}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary me-2" onClick={() => startEdit(c)}>✏️ Modifier</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => supprimer(c.id)}>🗑️ Supprimer</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan="4">
                                        <div className="empty-state">
                                            <div className="icon">👤</div>
                                            <p>Aucun client</p>
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