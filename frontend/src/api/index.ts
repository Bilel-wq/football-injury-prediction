import axios from 'axios';
import type { Player, PlayerDetail, RiskHistoryPoint, SkeletonData, TaskStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const getPlayers = (): Promise<Player[]> =>
  api.get('/players').then(r => r.data);

export const getPlayer = (id: number): Promise<PlayerDetail> =>
  api.get(`/players/${id}`).then(r => r.data);

export const getRiskHistory = (id: number): Promise<RiskHistoryPoint[]> =>
  api.get(`/players/${id}/risk-history`).then(r => r.data);

export const getSkeleton = (id: number): Promise<SkeletonData> =>
  api.get(`/players/${id}/skeleton`).then(r => r.data);

export const uploadVideo = (file: File): Promise<{ task_id: string; filename: string; status: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const getTaskStatus = (taskId: string): Promise<TaskStatus> =>
  api.get(`/tasks/${taskId}/status`).then(r => r.data);
