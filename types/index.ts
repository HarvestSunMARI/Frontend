export type UserRole = 'gapoktan' | 'penyuluh' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  wilayah?: string;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'drought' | 'storm' | 'frost';
  severity: 'low' | 'medium' | 'high';
  message: string;
  location: string;
  timestamp: Date;
}

export interface HarvestData {
  id: string;
  crop: string;
  quantity: number;
  unit: string;
  date: Date;
  location: string;
  quality: 'A' | 'B' | 'C';
}

export interface Field {
  id: string;
  name: string;
  area: number;
  crop: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'harvested' | 'preparing';
  lastUpdated: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  createdAt: Date;
}

export interface Report {
  id: string;
  title: string;
  type: 'harvest' | 'weather' | 'pest' | 'soil';
  status: 'draft' | 'submitted' | 'reviewed';
  author: string;
  location: string;
  createdAt: Date;
  content: string;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details: string;
  ip?: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'meeting' | 'inspection' | 'harvest' | 'training';
  location: string;
}

export interface Tugas {
  id: string;
  judul: string;
  deskripsi?: string;
  penyuluh_id: string;
  penyuluh_nama: string;
  gapoktan_id: string;
  gapoktan_nama: string;
  gapoktan_wilayah?: string;
  tanggal_dibuat: string;
  tanggal_mulai?: string;
  deadline: string;
  status: string;
  lampiran_url?: string;
  created_at: string;
  updated_at: string;
  jenis: string;
}

export interface Gapoktan {
  id: string;
  name: string;
  email: string;
  wilayah?: string;
  desa_binaan?: string[];
  ketua_gapoktan?: boolean;
}