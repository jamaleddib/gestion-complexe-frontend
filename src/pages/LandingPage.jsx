import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function LandingPage() {
    const [terrains, setTerrains] = useState([]);
    const [terrainsFiltres, setTerrainsFiltres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeSelectionne, setTypeSelectionne] = useState('tous');
    const [types, setTypes] = useState([]);

    useEffect(() => {
        api.get('/terrains-public')
            .then((res) => {
                setTerrains(res.data);
                setTerrainsFiltres(res.data);
                const typesUniques = [...new Set(res.data.map((t) => t.type).filter(Boolean))];
                setTypes(typesUniques);
            })
            .catch(() => setTerrains([]))
            .finally(() => setLoading(false));
    }, []);

    const filtrerParType = (type) => {
        setTypeSelectionne(type);
        if (type === 'tous') {
            setTerrainsFiltres(terrains);
        } else {
            setTerrainsFiltres(terrains.filter((t) => t.type === type));
        }
    };

    const getIconType = (type) => {
        const icons = {
            Football: '⚽',
            Basketball: '🏀',
            Tennis: '🎾',
            Volleyball: '🏐',
            Padel: '🏓',
        };
        return icons[type] || '🏟️';
    };

    return (
        <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            {/* STYLES RESPONSIVES */}
            <style>{`
                /* ===== NAVBAR ===== */
                .navbar-custom {
                    padding: 1rem 2rem;
                    flex-wrap: wrap;
                }
                .navbar-brand {
                    font-size: 1.5rem;
                }
                .navbar-links {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .navbar-links a {
                    font-size: 0.95rem;
                }

                /* ===== HERO ===== */
                .hero-title {
                    font-size: 3.5rem;
                }
                .hero-subtitle {
                    font-size: 1.2rem;
                }
                .hero-stats {
                    gap: 3rem;
                }
                .hero-stat-number {
                    font-size: 2rem;
                }

                /* ===== FILTRES ===== */
                .filtres-container {
                    gap: 0.75rem;
                }
                .filtre-btn {
                    padding: 0.6rem 1.5rem;
                    font-size: 0.9rem;
                }

                /* ===== CARTES TERRAINS ===== */
                .terrains-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                .terrain-card img {
                    height: 200px;
                    object-fit: cover;
                }

                /* ===== SECTIONS ===== */
                .section-title {
                    font-size: 2.2rem;
                }
                .section-padding {
                    padding: 5rem 2rem;
                }

                /* ===== RESPONSIVE BREAKPOINTS ===== */
                @media (max-width: 992px) {
                    .navbar-custom {
                        padding: 0.75rem 1rem;
                    }
                    .navbar-brand {
                        font-size: 1.2rem;
                    }
                    .navbar-links {
                        gap: 0.5rem;
                    }
                    .navbar-links a {
                        font-size: 0.85rem;
                    }
                    .hero-title {
                        font-size: 2.8rem;
                    }
                    .hero-subtitle {
                        font-size: 1rem;
                    }
                    .hero-stats {
                        gap: 2rem;
                    }
                    .hero-stat-number {
                        font-size: 1.8rem;
                    }
                    .section-title {
                        font-size: 2rem;
                    }
                    .section-padding {
                        padding: 4rem 1.5rem;
                    }
                    .filtres-container {
                        gap: 0.5rem;
                    }
                    .filtre-btn {
                        padding: 0.4rem 1rem;
                        font-size: 0.8rem;
                    }
                    .terrains-grid {
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    }
                    .terrain-card img {
                        height: 160px;
                    }
                }

                @media (max-width: 576px) {
                    .navbar-custom {
                        padding: 0.5rem 1rem;
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .navbar-brand {
                        font-size: 1.1rem;
                        text-align: center;
                        margin-bottom: 0.5rem;
                    }
                    .navbar-links {
                        justify-content: center;
                        gap: 0.3rem;
                    }
                    .navbar-links a {
                        font-size: 0.75rem;
                        padding: 0.3rem 0.6rem;
                    }
                    .hero-title {
                        font-size: 2rem;
                    }
                    .hero-subtitle {
                        font-size: 0.9rem;
                    }
                    .hero-stats {
                        gap: 1.5rem;
                        flex-direction: column;
                    }
                    .hero-stat-number {
                        font-size: 1.5rem;
                    }
                    .section-title {
                        font-size: 1.6rem;
                    }
                    .section-padding {
                        padding: 3rem 1rem;
                    }
                    .filtres-container {
                        gap: 0.3rem;
                        justify-content: center;
                    }
                    .filtre-btn {
                        padding: 0.3rem 0.8rem;
                        font-size: 0.7rem;
                    }
                    .terrains-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    .terrain-card img {
                        height: 140px;
                    }
                    .cta-buttons {
                        flex-direction: column;
                        align-items: center;
                    }
                    .cta-buttons a {
                        width: 100%;
                        text-align: center;
                    }
                }
            `}</style>

            {/* ===== NAVBAR ===== */}
            <nav className="navbar-custom" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div className="navbar-brand" style={{ color: 'white', fontWeight: '800' }}>
                    🏟️Complexe Sportif
                </div>
                <div className="navbar-links">
                    <a href="#terrains" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '500' }}>
                        🏟️ Nos Terrains
                    </a>
                    <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '500' }}>
                        ℹ️ À propos
                    </a>
                    <Link to="/login" style={{
                        color: 'white', textDecoration: 'none',
                        padding: '0.5rem 1.2rem', borderRadius: '8px',
                        border: '1.5px solid #475569', fontWeight: '600',
                    }}>
                        Connexion
                    </Link>
                    <Link to="/register" style={{
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: 'white', textDecoration: 'none',
                        padding: '0.5rem 1.2rem', borderRadius: '8px',
                        fontWeight: '600', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    }}>
                        Créer un compte
                    </Link>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '4rem 2rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-100px', right: '-100px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'rgba(37, 99, 235, 0.15)',
                }}></div>
                <div style={{
                    position: 'absolute', bottom: '-150px', left: '-100px',
                    width: '500px', height: '500px', borderRadius: '50%',
                    background: 'rgba(37, 99, 235, 0.1)',
                }}></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(37, 99, 235, 0.2)',
                        color: '#93c5fd',
                        padding: '0.4rem 1rem',
                        borderRadius: '50px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(37, 99, 235, 0.3)',
                    }}>
                        ⚽ Réservation en ligne disponible 24h/24
                    </div>

                    <h1 className="hero-title" style={{
                        color: 'white',
                        fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem',
                    }}>
                        Réservez votre terrain<br />
                        <span style={{ color: '#60a5fa' }}>en quelques clics</span>
                    </h1>

                    <p className="hero-subtitle" style={{
                        color: '#94a3b8', marginBottom: '2.5rem', lineHeight: '1.6'
                    }}>
                        Football, Basketball, Tennis — Trouvez le terrain idéal,
                        réservez votre créneau et payez en ligne en toute sécurité.
                    </p>

                    <div className="cta-buttons" style={{
                        display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'
                    }}>
                        <Link to="/register" style={{
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            color: 'white', textDecoration: 'none',
                            padding: '1rem 2.5rem', borderRadius: '12px',
                            fontWeight: '700', fontSize: '1.1rem',
                            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                        }}>
                            🚀 Créer un compte gratuit
                        </Link>
                        <a href="#terrains" style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white', textDecoration: 'none',
                            padding: '1rem 2.5rem', borderRadius: '12px',
                            fontWeight: '700', fontSize: '1.1rem',
                            border: '1.5px solid rgba(255,255,255,0.2)',
                        }}>
                            🏟️ Voir les terrains
                        </a>
                    </div>

                    <div className="hero-stats" style={{
                        display: 'flex', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap'
                    }}>
                        {[
                            { num: '10+', label: 'Terrains disponibles' },
                            { num: '24h', label: 'Réservation rapide' },
                            { num: '100%', label: 'Paiement sécurisé' },
                        ].map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div className="hero-stat-number" style={{ color: '#60a5fa', fontWeight: '800' }}>{stat.num}</div>
                                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COMMENT ÇA MARCHE ===== */}
            <section className="section-padding" style={{ background: '#f8fafc' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 className="section-title" style={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                        Comment ça marche ?
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '3rem' }}>Réservez votre terrain en 3 étapes simples</p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { icon: '👤', titre: '1. Créez un compte', desc: 'Inscrivez-vous gratuitement en quelques secondes avec votre email.' },
                            { icon: '🏟️', titre: '2. Choisissez un terrain', desc: 'Parcourez nos terrains et sélectionnez votre créneau horaire.' },
                            { icon: '💳', titre: '3. Payez et jouez !', desc: 'Payez par carte ou espèces et téléchargez votre ticket.' },
                        ].map((step, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: '16px',
                                padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{step.icon}</div>
                                <h3 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{step.titre}</h3>
                                <p style={{ color: '#64748b', lineHeight: '1.6' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="terrains" className="section-padding" style={{ background: 'white' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 className="section-title" style={{ fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                            Nos Terrains
                        </h2>
                        <p style={{ color: '#64748b' }}>Découvrez nos installations sportives de qualité</p>
                    </div>

                    <div className="filtres-container" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '2.5rem',
                    }}>
                        <button
                            onClick={() => filtrerParType('tous')}
                            className="filtre-btn"
                            style={{
                                borderRadius: '50px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: typeSelectionne === 'tous'
                                    ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                    : '#f1f5f9',
                                color: typeSelectionne === 'tous' ? 'white' : '#475569',
                                boxShadow: typeSelectionne === 'tous'
                                    ? '0 4px 12px rgba(37, 99, 235, 0.3)'
                                    : 'none',
                            }}
                        >
                            🏟️ Tous ({terrains.length})
                        </button>
                        {types.map((type) => (
                            <button
                                key={type}
                                onClick={() => filtrerParType(type)}
                                className="filtre-btn"
                                style={{
                                    borderRadius: '50px',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: typeSelectionne === type
                                        ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                        : '#f1f5f9',
                                    color: typeSelectionne === type ? 'white' : '#475569',
                                    boxShadow: typeSelectionne === type
                                        ? '0 4px 12px rgba(37, 99, 235, 0.3)'
                                        : 'none',
                                }}
                            >
                                {getIconType(type)} {type} ({terrains.filter((t) => t.type === type).length})
                            </button>
                        ))}
                    </div>

                    {/* RÉSULTATS */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="spinner-border" style={{ color: '#2563eb' }}></div>
                        </div>
                    ) : terrainsFiltres.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '3rem',
                            color: '#94a3b8', background: '#f8fafc',
                            borderRadius: '16px',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <p style={{ fontWeight: '600' }}>Aucun terrain de type "{typeSelectionne}"</p>
                            <button
                                onClick={() => filtrerParType('tous')}
                                style={{
                                    background: '#2563eb', color: 'white',
                                    border: 'none', padding: '0.5rem 1.5rem',
                                    borderRadius: '8px', cursor: 'pointer',
                                    fontWeight: '600', marginTop: '0.5rem',
                                }}
                            >
                                Voir tous les terrains
                            </button>
                        </div>
                    ) : (
                        <>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem', textAlign: 'center' }}>
                                <strong>{terrainsFiltres.length}</strong> terrain{terrainsFiltres.length > 1 ? 's' : ''} trouvé{terrainsFiltres.length > 1 ? 's' : ''}
                                {typeSelectionne !== 'tous' && <span> pour <strong>{typeSelectionne}</strong></span>}
                            </p>

                            <div className="terrains-grid">
                                {terrainsFiltres.map((t) => (
                                    <div key={t.id} className="terrain-card" style={{
                                        background: '#f8fafc', borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        border: '1px solid #e2e8f0',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                                    }}
                                    >
                                        {t.photo ? (
                                            <img
                                                src={`http://127.0.0.1:8000/storage/${t.photo}`}
                                                alt={t.nom}
                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%', height: '200px',
                                                background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                                                display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontSize: '5rem',
                                            }}>
                                                {getIconType(t.type)}
                                            </div>
                                        )}
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontWeight: '700', color: '#1e293b', margin: 0 }}>{t.nom}</h3>
                                                {t.type && (
                                                    <span style={{
                                                        background: '#dbeafe', color: '#1d4ed8',
                                                        padding: '0.25rem 0.75rem', borderRadius: '50px',
                                                        fontSize: '0.75rem', fontWeight: '600',
                                                    }}>
                                                        {getIconType(t.type)} {t.type}
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ color: '#2563eb', fontWeight: '800', fontSize: '1.3rem', margin: '0.5rem 0' }}>
                                                {t.prix} DH
                                                <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '400' }}> /heure</span>
                                            </p>
                                            <Link to="/login" style={{
                                                display: 'block',
                                                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                                color: 'white', textDecoration: 'none',
                                                padding: '0.75rem', borderRadius: '10px',
                                                textAlign: 'center', fontWeight: '600',
                                                marginTop: '1rem',
                                            }}>
                                                📅 Réserver ce terrain
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link to="/register" style={{
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            color: 'white', textDecoration: 'none',
                            padding: '1rem 2.5rem', borderRadius: '12px',
                            fontWeight: '700', fontSize: '1rem',
                            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
                        }}>
                            🚀 S'inscrire pour réserver
                        </Link>
                    </div>
                </div>
            </section>

            <section id="about" className="section-padding" style={{ background: '#f8fafc' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 className="section-title" style={{ fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
                        À propos du complexe
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
                        Notre complexe sportif vous offre des installations modernes pour
                        la pratique du football, basketball, tennis et bien plus encore.
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {[
                            { icon: '🏟️', label: 'Terrains modernes' },
                            { icon: '💡', label: 'Éclairage nocturne' },
                            { icon: '🚿', label: 'Vestiaires équipés' },
                            { icon: '🅿️', label: 'Parking gratuit' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: '12px',
                                padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                                <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{
                background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                padding: '5rem 2rem', textAlign: 'center',
            }}>
                <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                    Prêt à réserver votre terrain ?
                </h2>
                <p style={{ color: '#93c5fd', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Rejoignez-nous et profitez de nos installations dès aujourd'hui
                </p>
                <div className="cta-buttons" style={{
                    display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'
                }}>
                    <Link to="/register" style={{
                        background: 'white', color: '#1d4ed8',
                        textDecoration: 'none', padding: '1rem 2.5rem',
                        borderRadius: '12px', fontWeight: '700', fontSize: '1rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}>
                        🚀 Créer un compte
                    </Link>
                    <Link to="/login" style={{
                        background: 'transparent', color: 'white',
                        textDecoration: 'none', padding: '1rem 2.5rem',
                        borderRadius: '12px', fontWeight: '700', fontSize: '1rem',
                        border: '2px solid rgba(255,255,255,0.4)',
                    }}>
                        🔑 Se connecter
                    </Link>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer style={{
                background: '#0f172a', color: '#64748b',
                padding: '2rem', textAlign: 'center',
            }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    © 2026 Complexe Sportif — Tous droits réservés
                </p>
            </footer>
        </div>
    );
}