import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../utils/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await authApi.register({ username, email, password });
      navigate('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Créer un compte Admin</h2>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>AIoT Sports Analytics</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              required
              className="w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              required
              className="w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>
          {error && (
            <p className="text-sm mb-4" style={{ color: '#ef4444' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#3b82f6' }}
          >
            {loading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#3b82f6' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
