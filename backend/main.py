from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import random
import uuid
import os
import string

from model_loader import predict_risk

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:football_pass@localhost:5432/football_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "football-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Models
class PlayerDB(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    number = Column(Integer, nullable=False)
    position = Column(String, nullable=False)
    image_url = Column(String)

class RiskScoreDB(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AnalysisSessionDB(Base):
    __tablename__ = "analysis_sessions"
    id = Column(String, primary_key=True)
    video_filename = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class KeypointDataDB(Base):
    __tablename__ = "keypoint_data"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("analysis_sessions.id"))
    player_id = Column(Integer, ForeignKey("players.id"))
    frame = Column(Integer)
    keypoints = Column(JSON)

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="admin")
    created_at = Column(DateTime, default=datetime.utcnow)

class PlayerAccountDB(Base):
    __tablename__ = "player_accounts"
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"), unique=True, nullable=False)
    login_id = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    plain_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Pydantic schemas
class PlayerSchema(BaseModel):
    id: int
    name: str
    number: int
    position: str
    image_url: Optional[str]
    current_risk: Optional[float] = 0

    class Config:
        from_attributes = True

class RiskHistoryPoint(BaseModel):
    timestamp: str
    score: float

class PlayerDetailSchema(BaseModel):
    id: int
    name: str
    number: int
    position: str
    image_url: Optional[str]
    current_risk: float
    risk_history: List[RiskHistoryPoint]

class SkeletonSchema(BaseModel):
    player_id: int
    frame: int
    keypoints: dict

class PredictRequest(BaseModel):
    player_id: int
    keypoint_sequence: List[dict]
    player_stats: Optional[dict] = None

class PredictResponse(BaseModel):
    player_id: int
    risk_score: float
    risk_level: str

class AdminRegister(BaseModel):
    username: str
    email: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: AdminResponse

class AddPlayerRequest(BaseModel):
    name: str
    number: int
    position: str
    image_url: Optional[str] = None

class PlayerAccountResponse(BaseModel):
    player_id: int
    player_name: str
    login_id: str
    plain_password: str
    message: str

# Seed data
PLAYERS_DATA = [
    {"id": 1, "name": "K. Mbappé", "number": 10, "position": "Attaquant"},
    {"id": 2, "name": "J. Bellingham", "number": 5, "position": "Milieu"},
    {"id": 3, "name": "E. Militão", "number": 3, "position": "Défenseur"},
    {"id": 4, "name": "Vinícius Jr.", "number": 7, "position": "Attaquant"},
    {"id": 5, "name": "E. Camavinga", "number": 12, "position": "Milieu"},
    {"id": 6, "name": "T. Courtois", "number": 1, "position": "Gardien"},
    {"id": 7, "name": "D. Carvajal", "number": 2, "position": "Défenseur"},
    {"id": 8, "name": "A. Tchouaméni", "number": 8, "position": "Milieu"},
    {"id": 9, "name": "F. Valverde", "number": 15, "position": "Milieu"},
    {"id": 10, "name": "L. Modric", "number": 10, "position": "Milieu"},
    {"id": 11, "name": "T. Kroos", "number": 8, "position": "Milieu"},
    {"id": 12, "name": "R. Benzema", "number": 9, "position": "Attaquant"},
    {"id": 13, "name": "A. Rudiger", "number": 22, "position": "Défenseur"},
    {"id": 14, "name": "N. Nacho", "number": 6, "position": "Défenseur"},
    {"id": 15, "name": "L. Vázquez", "number": 17, "position": "Attaquant"},
    {"id": 16, "name": "M. Asensio", "number": 11, "position": "Milieu"},
    {"id": 17, "name": "D. Ceballos", "number": 19, "position": "Milieu"},
    {"id": 18, "name": "M. Diaz", "number": 21, "position": "Milieu"},
    {"id": 19, "name": "B. Lunin", "number": 13, "position": "Gardien"},
    {"id": 20, "name": "J. Morcillo", "number": 24, "position": "Attaquant"},
    {"id": 21, "name": "N. Güler", "number": 26, "position": "Milieu"},
    {"id": 22, "name": "P. Arda", "number": 25, "position": "Attaquant"},
    {"id": 23, "name": "F. Garcia", "number": 16, "position": "Défenseur"},
    {"id": 24, "name": "A. Mendy", "number": 23, "position": "Défenseur"},
    {"id": 25, "name": "D. Alaba", "number": 4, "position": "Défenseur"},
    {"id": 26, "name": "M. Fran García", "number": 20, "position": "Défenseur"},
]

RISK_SCORES = [15, 55, 85, 20, 35, 5, 70, 42, 28, 60, 45, 75, 18, 88, 32, 50, 65, 22, 8, 40, 78, 25, 92, 38, 55, 12]

def seed_database():
    db = SessionLocal()
    try:
        if db.query(PlayerDB).count() > 0:
            return
        for i, p in enumerate(PLAYERS_DATA):
            initials = "+".join(p["name"].replace(".", "").split()[:2])
            image_url = f"https://ui-avatars.com/api/?name={initials}&background=0D8ABC&color=fff&size=100"
            player = PlayerDB(id=p["id"], name=p["name"], number=p["number"], position=p["position"], image_url=image_url)
            db.add(player)
            # Add risk history for last 7 days
            base_risk = RISK_SCORES[i]
            for day in range(7, -1, -1):
                variation = random.uniform(-10, 10)
                score = max(0, min(100, base_risk + variation))
                timestamp = datetime.utcnow() - timedelta(days=day)
                risk = RiskScoreDB(player_id=p["id"], score=round(score, 1), timestamp=timestamp)
                db.add(risk)
        db.commit()
        # Add mock keypoint data
        session = AnalysisSessionDB(id="mock-session-1", video_filename="sample.mp4", status="completed")
        db.add(session)
        for player_id in range(1, 27):
            kp = KeypointDataDB(
                session_id="mock-session-1",
                player_id=player_id,
                frame=1,
                keypoints={
                    "nose": [0.5, 0.1], "left_shoulder": [0.4, 0.3], "right_shoulder": [0.6, 0.3],
                    "left_elbow": [0.35, 0.45], "right_elbow": [0.65, 0.45],
                    "left_wrist": [0.3, 0.55], "right_wrist": [0.7, 0.55],
                    "left_hip": [0.42, 0.6], "right_hip": [0.58, 0.6],
                    "left_knee": [0.4, 0.75], "right_knee": [0.6, 0.75],
                    "left_ankle": [0.38, 0.9], "right_ankle": [0.62, 0.9]
                }
            )
            db.add(kp)
        db.commit()
    finally:
        db.close()

# FastAPI app
app = FastAPI(title="Football Injury Prediction API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    seed_database()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_player_login_id(db: Session) -> str:
    count = db.query(PlayerAccountDB).count()
    return f"PLY-{str(count + 1).zfill(5)}"

def generate_player_password(length: int = 10) -> str:
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(UserDB).filter(UserDB.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/api/players", response_model=List[PlayerSchema])
def get_players(db: Session = Depends(get_db)):
    players = db.query(PlayerDB).all()
    result = []
    for player in players:
        latest = db.query(RiskScoreDB).filter(RiskScoreDB.player_id == player.id).order_by(RiskScoreDB.timestamp.desc()).first()
        result.append(PlayerSchema(
            id=player.id, name=player.name, number=player.number,
            position=player.position, image_url=player.image_url,
            current_risk=latest.score if latest else 0
        ))
    return result

@app.get("/api/players/{player_id}", response_model=PlayerDetailSchema)
def get_player(player_id: int, db: Session = Depends(get_db)):
    player = db.query(PlayerDB).filter(PlayerDB.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    latest = db.query(RiskScoreDB).filter(RiskScoreDB.player_id == player_id).order_by(RiskScoreDB.timestamp.desc()).first()
    history = db.query(RiskScoreDB).filter(RiskScoreDB.player_id == player_id).order_by(RiskScoreDB.timestamp.asc()).all()
    return PlayerDetailSchema(
        id=player.id, name=player.name, number=player.number,
        position=player.position, image_url=player.image_url,
        current_risk=latest.score if latest else 0,
        risk_history=[RiskHistoryPoint(timestamp=r.timestamp.isoformat(), score=r.score) for r in history]
    )

@app.get("/api/players/{player_id}/risk-history", response_model=List[RiskHistoryPoint])
def get_risk_history(player_id: int, db: Session = Depends(get_db)):
    player = db.query(PlayerDB).filter(PlayerDB.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    history = db.query(RiskScoreDB).filter(RiskScoreDB.player_id == player_id).order_by(RiskScoreDB.timestamp.asc()).all()
    return [RiskHistoryPoint(timestamp=r.timestamp.isoformat(), score=r.score) for r in history]

@app.get("/api/players/{player_id}/skeleton")
def get_skeleton(player_id: int, db: Session = Depends(get_db)):
    kp = db.query(KeypointDataDB).filter(KeypointDataDB.player_id == player_id).order_by(KeypointDataDB.frame.desc()).first()
    if not kp:
        raise HTTPException(status_code=404, detail="Données squelette non trouvées")
    return {"player_id": player_id, "frame": kp.frame, "keypoints": kp.keypoints}

@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    task_id = str(uuid.uuid4())
    upload_dir = "/tmp/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"task_id": task_id, "filename": file.filename, "status": "processing"}

@app.get("/api/tasks/{task_id}/status")
def get_task_status(task_id: str):
    return {"task_id": task_id, "status": "completed", "progress": 100}

@app.post("/api/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    risk_score = predict_risk(request.keypoint_sequence, player_stats=request.player_stats)
    if risk_score < 30:
        risk_level = "faible"
    elif risk_score < 60:
        risk_level = "modéré"
    else:
        risk_level = "critique"
    return PredictResponse(player_id=request.player_id, risk_score=risk_score, risk_level=risk_level)

@app.get("/")
def root():
    return {"message": "Football Injury Prediction API", "docs": "/docs"}

# Admin Registration
@app.post("/auth/register", response_model=AdminResponse)
def register(user: AdminRegister, db: Session = Depends(get_db)):
    existing = db.query(UserDB).filter(
        (UserDB.username == user.username) | (UserDB.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    hashed = pwd_context.hash(user.password)
    new_user = UserDB(username=user.username, email=user.email, hashed_password=hashed, role="admin")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Admin Login
@app.post("/auth/login", response_model=TokenResponse)
def login(user: AdminLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer", "user": db_user}

# Get current admin info
@app.get("/auth/me", response_model=AdminResponse)
def get_me(current_user: UserDB = Depends(get_current_user)):
    return current_user

# Admin adds a player (player gets auto login_id + password)
@app.post("/admin/add-player", response_model=PlayerAccountResponse)
def add_player(
    player_data: AddPlayerRequest,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    image_url = player_data.image_url or f"https://ui-avatars.com/api/?name={player_data.name.replace(' ', '+')}&background=0D8ABC&color=fff&size=100"
    new_player = PlayerDB(
        name=player_data.name,
        number=player_data.number,
        position=player_data.position,
        image_url=image_url
    )
    db.add(new_player)
    db.commit()
    db.refresh(new_player)

    login_id = generate_player_login_id(db)
    plain_password = generate_player_password()
    hashed_password = pwd_context.hash(plain_password)

    player_account = PlayerAccountDB(
        player_id=new_player.id,
        login_id=login_id,
        hashed_password=hashed_password,
        plain_password=plain_password
    )
    db.add(player_account)
    db.commit()

    return {
        "player_id": new_player.id,
        "player_name": new_player.name,
        "login_id": login_id,
        "plain_password": plain_password,
        "message": f"Player {new_player.name} added successfully! Share these credentials with the player."
    }

# Get all player accounts (admin only)
@app.get("/admin/player-accounts")
def get_player_accounts(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    accounts = db.query(PlayerAccountDB, PlayerDB).join(
        PlayerDB, PlayerAccountDB.player_id == PlayerDB.id
    ).all()
    return [
        {
            "player_id": acc.PlayerAccountDB.player_id,
            "player_name": acc.PlayerDB.name,
            "login_id": acc.PlayerAccountDB.login_id,
            "plain_password": acc.PlayerAccountDB.plain_password,
            "created_at": acc.PlayerAccountDB.created_at
        }
        for acc in accounts
    ]
