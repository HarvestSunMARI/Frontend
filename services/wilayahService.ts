const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface WilayahPenyuluh {
  id: number;
  wilayah: string;
  created_at: string;
}

export interface Konsultan {
  id: string;
  name: string;
  email: string;
  wilayah: string;
}

// Dapatkan wilayah yang dibawahi penyuluh
export const getWilayahPenyuluh = async (): Promise<WilayahPenyuluh[]> => {
  try {
    const response = await fetch(`${API_URL}/wilayah/penyuluh`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'user-id': localStorage.getItem('userId') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data wilayah');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wilayah:', error);
    throw error;
  }
};

// Tambah wilayah untuk penyuluh
export const addWilayahPenyuluh = async (wilayah: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/wilayah/penyuluh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'user-id': localStorage.getItem('userId') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wilayah }),
    });

    if (!response.ok) {
      throw new Error('Gagal menambah wilayah');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding wilayah:', error);
    throw error;
  }
};

// Hapus wilayah dari penyuluh
export const removeWilayahPenyuluh = async (wilayah: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/wilayah/penyuluh/${encodeURIComponent(wilayah)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'user-id': localStorage.getItem('userId') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus wilayah');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing wilayah:', error);
    throw error;
  }
};

// Dapatkan konsultan berdasarkan wilayah
export const getKonsultanByWilayah = async (wilayah: string): Promise<Konsultan[]> => {
  try {
    const response = await fetch(`${API_URL}/wilayah/${encodeURIComponent(wilayah)}/konsultan`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data konsultan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching konsultan by wilayah:', error);
    throw error;
  }
}; 