export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  image_url: string;
  current_risk: number;
}

export interface RiskHistoryPoint {
  timestamp: string;
  score: number;
}

export interface PlayerDetail extends Player {
  risk_history: RiskHistoryPoint[];
}

export interface SkeletonData {
  player_id: number;
  frame: number;
  keypoints: Record<string, [number, number]>;
}

export interface TaskStatus {
  task_id: string;
  status: string;
  progress: number;
}
