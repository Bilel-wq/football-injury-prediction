import React from 'react';

interface RiskGaugeProps {
  value: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ value }) => {
  const radius = 70;
  const circumference = Math.PI * radius; // semicircle
  const progress = (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v < 30) return '#22c55e';
    if (v < 60) return '#eab308';
    return '#ef4444';
  };

  const color = getColor(value);

  // SVG arc for semicircle gauge
  const startX = 20;
  const startY = 100;
  const endX = 180;
  const endY = 100;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x="100" y="95" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold">
          {value}%
        </text>
        <text x="100" y="115" textAnchor="middle" fill="#94a3b8" fontSize="12">
          Risque de blessure
        </text>
      </svg>
    </div>
  );
};

export default RiskGauge;
