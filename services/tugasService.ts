const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Gapoktan {
  id: string;
  name: string;
  email?: string;
  wilayah?: string;
}

export interface Tugas {
  id: string;
  judul: string;
  deskripsi?: string;
  jenis?: string;
  gapoktan_id: string;
  gapoktan_nama?: string;
  gapoktan_wilayah?: string;
  tanggal_dibuat: string;
  tanggal_mulai?: string;
  deadline: string;
  status: string;
  lampiran_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TugasData {
  judul: string;
  deskripsi?: string;
  jenis?: string;
  gapoktan_id: string;
  tanggal_mulai?: string;
  deadline: string;
  lampiran_url?: string;
}

export const getGapoktanList = async (): Promise<Gapoktan[]> => {
  const response = await fetch(`${API_URL}/gapoktan`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Gagal mengambil data gapoktan');
  return await response.json();
};

export const createTugas = async (data: TugasData): Promise<Tugas> => {
  const response = await fetch(`${API_URL}/tugas`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Gagal membuat tugas');
  return await response.json();
};

export const getTugasByPenyuluh = async (): Promise<Tugas[]> => {
  const response = await fetch(`${API_URL}/tugas/penyuluh`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Gagal mengambil data tugas');
  return await response.json();
};

export const deleteTugas = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/tugas/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Gagal menghapus tugas');
};

export const getTugasById = async (id: string): Promise<Tugas> => {
  const response = await fetch(`${API_URL}/tugas/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Gagal mengambil detail tugas');
  return await response.json();
}; 