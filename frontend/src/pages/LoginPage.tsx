import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../utils/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'admin' | 'player'>('admin');
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (role === 'admin') {
      setLoading(true);
      try {
        const result = await authApi.login({ username: identifiant, password });
        localStorage.setItem('admin_token', result.access_token);
        navigate('/admin');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Identifiants invalides');
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/player/1');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>AIoT Sports Analytics</h2>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Connectez-vous à votre espace</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-6">
            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border transition-all ${role === 'admin' ? 'border-blue-500 bg-blue-500/10' : ''}`} style={{ borderColor: role === 'admin' ? '#3b82f6' : 'var(--border-color)' }}>
              <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="sr-only" />
              <span style={{ color: 'var(--text-main)' }}>Staff / Admin</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border transition-all`} style={{ borderColor: role === 'player' ? '#3b82f6' : 'var(--border-color)', backgroundColor: role === 'player' ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
              <input type="radio" name="role" value="player" checked={role === 'player'} onChange={() => setRole('player')} className="sr-only" />
              <span style={{ color: 'var(--text-main)' }}>Joueur</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Identifiant ou Email</label>
            <input
              type="text"
              value={identifiant}
              onChange={e => setIdentifiant(e.target.value)}
              placeholder="Entrez votre identifiant"
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
          {error && (
            <p className="text-sm mb-4" style={{ color: '#ef4444' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#3b82f6' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        {role === 'admin' && (
          <p className="text-center mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#3b82f6' }}>Créer un compte admin</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
