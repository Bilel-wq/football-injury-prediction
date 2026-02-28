import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

const UploadPage: React.FC = () => {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Veuillez sélectionner un fichier vidéo.');
      return;
    }
    setFileName(file.name);
    setStatus('uploading');
    setProgress(0);

    // Simulate upload progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setStatus('processing');
        setTimeout(() => {
          setStatus('completed');
          setProgress(100);
        }, 2000);
      }
      setProgress(Math.min(Math.round(p), 100));
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--bg-main)' }}>
      <Link to="/dashboard" className="inline-flex items-center gap-2 mb-6 text-sm hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        ← Retour au tableau de bord
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Analyse Vidéo</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Importez une vidéo pour analyser les mouvements et prédire les risques de blessure</p>

        {status === 'idle' && (
          <div
            className="rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all"
            style={{
              backgroundColor: dragOver ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              border: `2px dashed ${dragOver ? '#3b82f6' : 'var(--border-color)'}`,
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Glissez-déposez votre vidéo ici</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>ou cliquez pour parcourir vos fichiers</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Formats supportés: MP4, AVI, MOV, MKV</p>
            <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileInput} />
          </div>
        )}

        {(status === 'uploading' || status === 'processing') && (
          <div className="rounded-xl p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🎬</span>
              <div>
                <p className="font-medium" style={{ color: 'var(--text-main)' }}>{fileName}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {status === 'uploading' ? 'Téléchargement en cours...' : 'Analyse en cours...'}
                </p>
              </div>
            </div>
            <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: 'var(--bg-main)' }}>
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: '#3b82f6' }}
              />
            </div>
            <p className="text-sm text-right" style={{ color: 'var(--text-muted)' }}>{progress}%</p>
            {status === 'processing' && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#22c55e' }}>
                  <span>✓</span><span>Vidéo téléchargée</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#3b82f6' }}>
                  <span>⏳</span><span>Extraction des keypoints en cours...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {status === 'completed' && (
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Analyse terminée !</h2>
            <p className="mb-2" style={{ color: 'var(--text-muted)' }}>Fichier: {fileName}</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Les données de mouvement ont été extraites et les risques ont été calculés.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard" className="px-6 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#3b82f6' }}>
                Voir le tableau de bord
              </Link>
              <button onClick={reset} className="px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                Nouvelle analyse
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
