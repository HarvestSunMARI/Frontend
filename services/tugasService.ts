const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface TugasData {
  judul: string;
  deskripsi?: string;
  konsultan_id: string;
  tanggal_mulai?: string;
  deadline: string;
  lampiran_url?: string;
}

export interface Konsultan {
  id: string;
  name: string;
  email: string;
  wilayah?: string;
}

export interface Tugas {
  id: string;
  judul: string;
  deskripsi?: string;
  penyuluh_id: string;
  penyuluh_nama: string;
  konsultan_id: string;
  konsultan_nama: string;
  konsultan_wilayah?: string;
  tanggal_dibuat: string;
  tanggal_mulai?: string;
  deadline: string;
  status: string;
  lampiran_url?: string;
  created_at: string;
  updated_at: string;
  jenis: string;
}

// Helper function untuk mendapatkan headers dengan token
const getHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('app_user') || sessionStorage.getItem('app_user') || '{}');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'user-id': user.id || ''
  };
};

// Dapatkan daftar konsultan untuk dropdown (berdasarkan wilayah penyuluh)
export const getKonsultanList = async (): Promise<Konsultan[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/konsultan-list`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Gagal mengambil data konsultan');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching konsultan list:', error);
    throw error;
  }
};

// Create tugas baru
export const createTugas = async (tugasData: TugasData): Promise<Tugas> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(tugasData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal membuat tugas');
    }

    const result = await response.json();
    return result.tugas;
  } catch (error) {
    console.error('Error creating tugas:', error);
    throw error;
  }
};

// Get tugas untuk penyuluh
export const getTugasByPenyuluh = async (): Promise<Tugas[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/penyuluh`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil daftar tugas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tugas:', error);
    throw error;
  }
};

// Get detail tugas
export const getTugasById = async (tugasId: string): Promise<Tugas> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/${tugasId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil detail tugas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tugas detail:', error);
    throw error;
  }
};

// Update tugas
export const updateTugas = async (tugasId: string, updateData: Partial<TugasData>): Promise<Tugas> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/${tugasId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal mengupdate tugas');
    }

    const result = await response.json();
    return result.tugas;
  } catch (error) {
    console.error('Error updating tugas:', error);
    throw error;
  }
};

// Delete tugas
export const deleteTugas = async (tugasId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/${tugasId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal menghapus tugas');
    }
  } catch (error) {
    console.error('Error deleting tugas:', error);
    throw error;
  }
};

// Update status tugas
export const updateTugasStatus = async (tugasId: string, status: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/${tugasId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal mengupdate status tugas');
    }
  } catch (error) {
    console.error('Error updating tugas status:', error);
    throw error;
  }
};

// Get riwayat tugas
export const getTugasRiwayat = async (tugasId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/${tugasId}/riwayat`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil riwayat tugas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tugas riwayat:', error);
    throw error;
  }
};

// Get komentar tugas
export const getTugasKomentar = async (tugasId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/${tugasId}/komentar`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil komentar tugas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tugas komentar:', error);
    throw error;
  }
};

// Add komentar tugas
export const addTugasKomentar = async (tugasId: string, komentar: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/${tugasId}/komentar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ komentar })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal menambahkan komentar');
    }

    const result = await response.json();
    return result.komentar;
  } catch (error) {
    console.error('Error adding komentar:', error);
    throw error;
  }
};

// Get tugas untuk konsultan
export const getTugasByKonsultan = async (): Promise<Tugas[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tugas/konsultan`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil daftar tugas konsultan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tugas konsultan:', error);
    throw error;
  }
}; 