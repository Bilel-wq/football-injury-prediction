import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockPlayers, getStatus } from '../data/mockPlayers';
import type { Player } from '../types';

const POSITIONS = ['Tous', 'Gardien', 'Défenseur', 'Milieu', 'Attaquant'];
const RISK_FILTERS = ['Tous', 'Optimal', 'À surveiller', 'Risque critique'];

const DashboardPage: React.FC = () => {
  const [players] = useState<Player[]>(mockPlayers);
  const [posFilter, setPosFilter] = useState('Tous');
  const [riskFilter, setRiskFilter] = useState('Tous');

  const filtered = players.filter(p => {
    const posOk = posFilter === 'Tous' || p.position === posFilter;
    let riskOk = true;
    if (riskFilter === 'Optimal') riskOk = p.current_risk < 30;
    else if (riskFilter === 'À surveiller') riskOk = p.current_risk >= 30 && p.current_risk < 60;
    else if (riskFilter === 'Risque critique') riskOk = p.current_risk >= 60;
    return posOk && riskOk;
  });

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--bg-main)' }}>
      <header className="flex justify-between items-center border-b pb-4 mb-8" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>Effectif & État Physique</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Analyse Biomécanique en Temps Réel</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#22c55e' }}></span> Optimal
          </span>
          <span className="flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#eab308' }}></span> À surveiller
          </span>
          <span className="flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#ef4444' }}></span> Risque critique
          </span>
          <Link to="/upload" className="ml-4 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: '#3b82f6' }}>
            + Analyse vidéo
          </Link>
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-2">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className="px-3 py-1 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: posFilter === pos ? '#3b82f6' : 'var(--bg-card)',
                color: posFilter === pos ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-color)'
              }}
            >
              {pos}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {RISK_FILTERS.map(rf => (
            <button
              key={rf}
              onClick={() => setRiskFilter(rf)}
              className="px-3 py-1 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: riskFilter === rf ? '#3b82f6' : 'var(--bg-card)',
                color: riskFilter === rf ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-color)'
              }}
            >
              {rf}
            </button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {filtered.map(player => {
          const status = getStatus(player.current_risk);
          const isCritical = player.current_risk >= 60;
          return (
            <Link
              key={player.id}
              to={`/player/${player.id}`}
              className="rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-1 no-underline"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'inherit',
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
            >
              <div className="relative mb-4">
                <img
                  src={player.image_url}
                  alt={player.name}
                  className="w-20 h-20 rounded-full object-cover"
                  style={{ border: '2px solid var(--border-color)' }}
                />
                <span
                  className={`absolute bottom-1 right-0 w-4 h-4 rounded-full border-2 ${isCritical ? 'critical-pulse' : ''}`}
                  style={{
                    backgroundColor: status.color,
                    borderColor: 'var(--bg-card)',
                  }}
                />
              </div>
              <h2 className="text-base font-semibold text-center mb-1" style={{ color: 'var(--text-main)' }}>{player.name}</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>#{player.number} - {player.position}</p>
              <div className="w-full rounded-full h-2 mb-1" style={{ backgroundColor: 'var(--bg-main)' }}>
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${player.current_risk}%`, backgroundColor: status.color }}
                />
              </div>
              <p className="text-xs font-bold" style={{ color: isCritical ? '#ef4444' : 'var(--text-main)' }}>
                Risque: {player.current_risk}%
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
