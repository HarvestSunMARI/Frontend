'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getWilayahPenyuluh, 
  addWilayahPenyuluh, 
  removeWilayahPenyuluh,
  WilayahPenyuluh 
} from '@/services/wilayahService';

export default function WilayahPage() {
  const [wilayah, setWilayah] = useState<WilayahPenyuluh[]>([]);
  const [newWilayah, setNewWilayah] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Load wilayah data
  const loadWilayah = async () => {
    try {
      setLoading(true);
      const data = await getWilayahPenyuluh();
      setWilayah(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal memuat data wilayah',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWilayah();
  }, []);

  // Add new wilayah
  const handleAddWilayah = async () => {
    if (!newWilayah.trim()) {
      toast({
        title: 'Error',
        description: 'Nama wilayah tidak boleh kosong',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAdding(true);
      await addWilayahPenyuluh(newWilayah.trim());
      setNewWilayah('');
      await loadWilayah();
      toast({
        title: 'Sukses',
        description: 'Wilayah berhasil ditambahkan',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal menambah wilayah',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  // Remove wilayah
  const handleRemoveWilayah = async (wilayahName: string) => {
    try {
      setDeleting(wilayahName);
      await removeWilayahPenyuluh(wilayahName);
      await loadWilayah();
      toast({
        title: 'Sukses',
        description: 'Wilayah berhasil dihapus',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal menghapus wilayah',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Wilayah</h1>
        <p className="text-gray-600 mt-2">
          Kelola wilayah yang Anda bimbing sebagai penyuluh
        </p>
      </div>

      {/* Add new wilayah */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Wilayah Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Masukkan nama wilayah/desa..."
              value={newWilayah}
              onChange={(e) => setNewWilayah(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWilayah()}
              className="flex-1"
            />
            <Button 
              onClick={handleAddWilayah} 
              disabled={adding || !newWilayah.trim()}
            >
              {adding ? 'Menambah...' : 'Tambah'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wilayah list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Daftar Wilayah yang Dibimbing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Memuat data wilayah...</p>
            </div>
          ) : wilayah.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada wilayah yang dibimbing</p>
              <p className="text-sm text-gray-500 mt-1">
                Tambahkan wilayah di atas untuk memulai
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {wilayah.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.wilayah}</h3>
                      <p className="text-sm text-gray-500">
                        Ditambahkan: {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {item.wilayah}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveWilayah(item.wilayah)}
                      disabled={deleting === item.wilayah}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deleting === item.wilayah ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 