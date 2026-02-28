import React, { useEffect, useRef } from 'react';

interface SkeletonCanvasProps {
  keypoints: Record<string, [number, number]>;
  width?: number;
  height?: number;
}

const CONNECTIONS = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
  ['nose', 'left_shoulder'],
  ['nose', 'right_shoulder'],
];

const SkeletonCanvas: React.FC<SkeletonCanvasProps> = ({ keypoints, width = 300, height = 350 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    const toPixel = (pt: [number, number]): [number, number] => [
      pt[0] * width,
      pt[1] * height,
    ];

    // Draw connections
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    CONNECTIONS.forEach(([a, b]) => {
      if (keypoints[a] && keypoints[b]) {
        const [ax, ay] = toPixel(keypoints[a]);
        const [bx, by] = toPixel(keypoints[b]);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    });

    // Draw joints
    Object.entries(keypoints).forEach(([name, pt]) => {
      const [x, y] = toPixel(pt as [number, number]);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = name === 'nose' ? '#f8fafc' : '#22c55e';
      ctx.fill();
    });
  }, [keypoints, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
      style={{ border: '1px solid var(--border-color)' }}
    />
  );
};

export default SkeletonCanvas;
