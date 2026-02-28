import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockPlayers, getStatus } from '../data/mockPlayers';
import type { RiskHistoryPoint, SkeletonData } from '../types';
import RiskGauge from '../components/RiskGauge';
import SkeletonCanvas from '../components/SkeletonCanvas';

const MOCK_HISTORY: RiskHistoryPoint[] = Array.from({ length: 8 }, (_, i) => ({
  timestamp: new Date(Date.now() - (7 - i) * 86400000).toISOString(),
  score: Math.round(Math.random() * 40 + 20),
}));

const MOCK_SKELETON: SkeletonData = {
  player_id: 1,
  frame: 1,
  keypoints: {
    "nose": [0.5, 0.08], "left_shoulder": [0.38, 0.28], "right_shoulder": [0.62, 0.28],
    "left_elbow": [0.3, 0.44], "right_elbow": [0.7, 0.44],
    "left_wrist": [0.24, 0.58], "right_wrist": [0.76, 0.58],
    "left_hip": [0.41, 0.6], "right_hip": [0.59, 0.6],
    "left_knee": [0.38, 0.76], "right_knee": [0.62, 0.76],
    "left_ankle": [0.36, 0.92], "right_ankle": [0.64, 0.92]
  }
};

const JOINT_ANGLES = [
  { joint: "Genou gauche", angle: "165°", status: "Normal" },
  { joint: "Genou droit", angle: "162°", status: "Normal" },
  { joint: "Hanche gauche", angle: "178°", status: "Normal" },
  { joint: "Hanche droite", angle: "172°", status: "Attention" },
  { joint: "Épaule gauche", angle: "88°", status: "Normal" },
  { joint: "Épaule droite", angle: "92°", status: "Normal" },
];

const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const player = mockPlayers.find(p => p.id === Number(id)) || mockPlayers[0];
  const status = getStatus(player.current_risk);
  const isCritical = player.current_risk >= 60;

  const chartData = MOCK_HISTORY.map((h, i) => ({
    jour: `J-${7 - i}`,
    risque: h.score,
  }));

  const alerts = [];
  if (player.current_risk >= 60) alerts.push({ type: 'danger', msg: 'Risque critique détecté — consultation médicale recommandée' });
  if (player.current_risk >= 30) alerts.push({ type: 'warning', msg: "Charge d'entraînement élevée cette semaine" });
  alerts.push({ type: 'info', msg: 'Prochain bilan biomécanique dans 3 jours' });

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Back button */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 mb-6 text-sm hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        ← Retour au tableau de bord
      </Link>

      {/* Player Header */}
      <div className="rounded-xl p-6 mb-6 flex items-center gap-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="relative">
          <img src={player.image_url} alt={player.name} className="w-24 h-24 rounded-full" style={{ border: '3px solid var(--border-color)' }} />
          <span
            className={`absolute bottom-1 right-0 w-5 h-5 rounded-full border-2 ${isCritical ? 'critical-pulse' : ''}`}
            style={{ backgroundColor: status.color, borderColor: 'var(--bg-card)' }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>{player.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>#{player.number} — {player.position}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: status.color }}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Risk Gauge */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Indice de Risque</h2>
            <RiskGauge value={player.current_risk} />
          </div>

          {/* Skeleton */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Squelette 2D</h2>
            <SkeletonCanvas keypoints={MOCK_SKELETON.keypoints} width={260} height={300} />
          </div>
        </div>

        {/* Middle column */}
        <div className="space-y-6">
          {/* Fatigue Chart */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Évolution du Risque (7 jours)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="jour" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line type="monotone" dataKey="risque" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Alertes</h2>
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{
                  backgroundColor: a.type === 'danger' ? 'rgba(239,68,68,0.1)' : a.type === 'warning' ? 'rgba(234,179,8,0.1)' : 'rgba(59,130,246,0.1)',
                  border: `1px solid ${a.type === 'danger' ? 'rgba(239,68,68,0.3)' : a.type === 'warning' ? 'rgba(234,179,8,0.3)' : 'rgba(59,130,246,0.3)'}`
                }}>
                  <span>{a.type === 'danger' ? '🔴' : a.type === 'warning' ? '🟡' : 'ℹ️'}</span>
                  <p className="text-sm" style={{ color: 'var(--text-main)' }}>{a.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Joint Angles */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Angles Articulaires</h2>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th className="text-left pb-2" style={{ color: 'var(--text-muted)' }}>Articulation</th>
                  <th className="text-center pb-2" style={{ color: 'var(--text-muted)' }}>Angle</th>
                  <th className="text-right pb-2" style={{ color: 'var(--text-muted)' }}>État</th>
                </tr>
              </thead>
              <tbody>
                {JOINT_ANGLES.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="py-3" style={{ color: 'var(--text-main)' }}>{row.joint}</td>
                    <td className="text-center py-3" style={{ color: 'var(--text-main)' }}>{row.angle}</td>
                    <td className="text-right py-3">
                      <span className="px-2 py-1 rounded-full text-xs" style={{
                        backgroundColor: row.status === 'Normal' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                        color: row.status === 'Normal' ? '#22c55e' : '#eab308'
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
