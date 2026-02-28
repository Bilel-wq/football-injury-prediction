# 🏃 Football Injury Prediction — AIoT Sports Analytics

Plateforme web complète de prédiction des blessures pour les équipes de football, basée sur l'analyse biomécanique en temps réel.

## 🛠️ Stack Technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + Recharts |
| Backend | FastAPI (Python) + SQLAlchemy + SQLite |
| Tâches async | Celery + Redis |
| Infrastructure | Docker + docker-compose + Nginx |

## 📋 Prérequis

- [Docker](https://www.docker.com/) >= 24.x
- [Docker Compose](https://docs.docker.com/compose/) >= 2.x
- (Développement local) Node.js >= 20, Python >= 3.11

## 🚀 Lancement rapide

### Avec Docker (recommandé)

```bash
git clone https://github.com/Bilel-wq/football-injury-prediction.git
cd football-injury-prediction
docker-compose up --build
```

L'application sera accessible sur :
- **Frontend** : http://localhost:80
- **Backend API** : http://localhost:8000
- **Swagger API Docs** : http://localhost:8000/docs

### Développement local

**Backend :**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend :**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📚 Documentation API

La documentation Swagger est auto-générée et disponible à : http://localhost:8000/docs

### Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/players` | Liste tous les joueurs avec leur score de risque actuel |
| GET | `/api/players/{id}` | Détails d'un joueur avec historique de risque |
| GET | `/api/players/{id}/risk-history` | Série temporelle des scores de risque |
| GET | `/api/players/{id}/skeleton` | Dernières données de keypoints |
| POST | `/api/upload-video` | Upload d'une vidéo pour analyse |
| GET | `/api/tasks/{task_id}/status` | Statut d'une tâche asynchrone |
| POST | `/api/predict` | Prédiction de risque à partir d'une séquence de keypoints |

## 🗂️ Structure du Projet

```
football-injury-prediction/
├── frontend/                   # Application React + TypeScript
│   ├── src/
│   │   ├── pages/              # LoginPage, DashboardPage, PlayerPage, UploadPage
│   │   ├── components/         # RiskGauge, SkeletonCanvas
│   │   ├── data/               # Données mock (26 joueurs)
│   │   ├── api/                # Client Axios
│   │   └── types/              # Types TypeScript
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                    # API FastAPI
│   ├── main.py                 # Application principale + seed data
│   ├── requirements.txt
│   └── Dockerfile
├── nginx/
│   └── nginx.conf              # Configuration reverse proxy
├── docker-compose.yml
└── README.md
```

## 🎨 Design System

L'interface utilise un thème sombre cohérent avec le code couleur suivant :

| Couleur | Code | Usage |
|---------|------|-------|
| 🟢 Vert | `#22c55e` | Risque < 30% (Optimal) |
| 🟡 Jaune | `#eab308` | Risque 30-60% (À surveiller) |
| 🔴 Rouge | `#ef4444` | Risque ≥ 60% (Risque critique) |

## 👥 Pages Principales

- **`/login`** — Page de connexion avec sélecteur de rôle (Staff/Admin ou Joueur)
- **`/dashboard`** — Grille des 26 joueurs avec filtres par poste et niveau de risque
- **`/player/:id`** — Profil détaillé avec jauge de risque, squelette 2D, graphique d'évolution et tableau des angles articulaires
- **`/upload`** — Upload vidéo avec glisser-déposer et suivi de progression
