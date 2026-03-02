import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../utils/api';

interface PlayerAccount {
  player_id: number;
  player_name: string;
  login_id: string;
  plain_password: string;
  created_at: string;
}

interface AddedPlayer {
  player_id: number;
  player_name: string;
  login_id: string;
  plain_password: string;
  message: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addedPlayer, setAddedPlayer] = useState<AddedPlayer | null>(null);
  const [accounts, setAccounts] = useState<PlayerAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadAccounts();
  }, [token, navigate]);

  const loadAccounts = async () => {
    if (!token) return;
    setAccountsLoading(true);
    try {
      const data = await authApi.getPlayerAccounts(token);
      if (Array.isArray(data)) {
        setAccounts(data);
      }
    } catch {
      // silently fail
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAddedPlayer(null);
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.addPlayer(
        {
          name,
          number: parseInt(number),
          position,
          image_url: imageUrl || undefined,
        },
        token
      );
      setAddedPlayer(result);
      setName('');
      setNumber('');
      setPosition('');
      setImageUrl('');
      loadAccounts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du joueur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--bg-main)' }}>
      <header className="flex justify-between items-center border-b pb-4 mb-8" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>Dashboard Admin</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Gestion des joueurs</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
        >
          Déconnexion
        </button>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Add Player Form */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-main)' }}>Ajouter un joueur</h2>
          <form onSubmit={handleAddPlayer}>
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: K. Mbappé"
                required
                className="w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Numéro</label>
              <input
                type="number"
                value={number}
                onChange={e => setNumber(e.target.value)}
                placeholder="Ex: 10"
                required
                min={1}
                className="w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Position</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value)}
                required
                className="w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
              >
                <option value="">Sélectionner une position</option>
                <option value="Gardien">Gardien</option>
                <option value="Défenseur">Défenseur</option>
                <option value="Milieu">Milieu</option>
                <option value="Attaquant">Attaquant</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>URL Image (optionnel)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://..."
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
              {loading ? 'Ajout en cours...' : 'Ajouter le joueur'}
            </button>
          </form>

          {addedPlayer && (
            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e' }}>
              <p className="font-semibold mb-3" style={{ color: '#22c55e' }}>✅ Joueur ajouté avec succès !</p>
              <div className="space-y-1 text-sm" style={{ color: 'var(--text-main)' }}>
                <p><span style={{ color: 'var(--text-muted)' }}>Joueur :</span> {addedPlayer.player_name}</p>
                <p><span style={{ color: 'var(--text-muted)' }}>Login ID :</span> <code className="px-1 rounded" style={{ backgroundColor: 'var(--bg-main)' }}>{addedPlayer.login_id}</code></p>
                <p><span style={{ color: 'var(--text-muted)' }}>Mot de passe :</span> <code className="px-1 rounded" style={{ backgroundColor: 'var(--bg-main)' }}>{addedPlayer.plain_password}</code></p>
              </div>
              <p className="mt-3 text-xs" style={{ color: '#eab308' }}>⚠️ Partagez ces identifiants avec le joueur</p>
            </div>
          )}
        </div>

        {/* Player Accounts Table */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-main)' }}>Comptes joueurs</h2>
          {accountsLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Chargement...</p>
          ) : accounts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Aucun compte joueur pour l'instant.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowPasswords(v => !v)}
                  className="text-xs px-3 py-1 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                >
                  {showPasswords ? '🙈 Masquer' : '👁 Révéler les mots de passe'}
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th className="text-left pb-3 pr-4" style={{ color: 'var(--text-muted)' }}>Joueur</th>
                    <th className="text-left pb-3 pr-4" style={{ color: 'var(--text-muted)' }}>Login ID</th>
                    <th className="text-left pb-3" style={{ color: 'var(--text-muted)' }}>Mot de passe</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(acc => (
                    <tr key={acc.player_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="py-3 pr-4" style={{ color: 'var(--text-main)' }}>{acc.player_name}</td>
                      <td className="py-3 pr-4">
                        <code className="px-1 rounded text-xs" style={{ backgroundColor: 'var(--bg-main)', color: '#3b82f6' }}>{acc.login_id}</code>
                      </td>
                      <td className="py-3">
                        <code className="px-1 rounded text-xs" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
                          {showPasswords ? acc.plain_password : '••••••••••'}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
