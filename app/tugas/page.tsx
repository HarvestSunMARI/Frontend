"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClipboardList, Plus, Eye, Edit, Trash2, Calendar, MapPin, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  getGapoktanList, 
  createTugas, 
  getTugasByPenyuluh, 
  deleteTugas,
  getTugasById,
  Gapoktan,
  Tugas,
  TugasData
} from '@/services/tugasService';
import { createClient } from '@supabase/supabase-js';

const getStatusColor = (status: string) => {
  switch (status) {
    case "Belum Dikerjakan":
      return "bg-yellow-100 text-yellow-800";
    case "Sedang Berlangsung":
      return "bg-blue-100 text-blue-800";
    case "Selesai":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const jenisTugasOptions = [
  { value: 'panen', label: 'Panen' },
  { value: 'inspeksi', label: 'Inspeksi' },
  { value: 'pelatihan', label: 'Pelatihan' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'lainnya', label: 'Lainnya' },
];

export default function TugasPage() {
  const { toast } = useToast();
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [gapoktanList, setGapoktanList] = useState<Gapoktan[]>([]);
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState<Tugas | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    jenis: "",
    gapoktanId: "",
    tanggalMulai: "",
    deadline: "",
    lampiran: null as File | null
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tugasData, gapoktanData] = await Promise.all([
        getTugasByPenyuluh(),
        getGapoktanList()
      ]);
      setTugas(tugasData);
      setGapoktanList(gapoktanData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal memuat data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTambahTugas = async () => {
    if (!formData.judul || !formData.gapoktanId || !formData.deadline || !formData.jenis) {
      toast({
        title: "Error",
        description: "Judul, jenis tugas, gapoktan, dan deadline harus diisi",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      let lampiranUrl: string | undefined = undefined;
      if (formData.lampiran && supabase) {
        const file = formData.lampiran;
        const filePath = `tugas/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('lampiran').upload(filePath, file, { upsert: true });
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from('lampiran').getPublicUrl(filePath);
        lampiranUrl = publicUrlData.publicUrl;
      }
      const tugasData: TugasData = {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        jenis: formData.jenis,
        gapoktan_id: formData.gapoktanId,
        tanggal_mulai: formData.tanggalMulai || undefined,
        deadline: formData.deadline,
        lampiran_url: lampiranUrl
      };
      const newTugas = await createTugas(tugasData);
      setTugas([newTugas, ...tugas]);
      setFormData({
        judul: "",
        deskripsi: "",
        jenis: "",
        gapoktanId: "",
        tanggalMulai: "",
        deadline: "",
        lampiran: null
      });
      setIsModalTambahOpen(false);
      toast({ title: "Sukses", description: "Tugas berhasil dibuat" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Gagal membuat tugas", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLihatDetail = async (tugas: Tugas) => {
    try {
      const detailTugas = await getTugasById(tugas.id);
      setSelectedTugas(detailTugas);
      setIsModalDetailOpen(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal memuat detail tugas",
        variant: "destructive"
      });
    }
  };

  const handleEditTugas = (tugas: Tugas) => {
    // Implementasi edit tugas
    console.log("Edit tugas:", tugas);
  };

  const handleHapusTugas = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      return;
    }

    try {
      await deleteTugas(id);
      setTugas(tugas.filter(t => t.id !== id));
      toast({
        title: "Sukses",
        description: "Tugas berhasil dihapus",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus tugas",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-earth-green-700 mb-1">
              <ClipboardList className="h-6 w-6 text-earth-green-600" /> Tugas untuk Gapoktan
            </h1>
            <p className="text-earth-brown-700">Kelola dan distribusikan tugas ke gapoktan di wilayah Anda.</p>
          </div>
          <Button onClick={() => setIsModalTambahOpen(true)} className="bg-green-700 hover:bg-green-800 text-white gap-2">
            <Plus className="h-4 w-4" /> Tambah Tugas
          </Button>
        </div>

        {/* Modal Tambah Tugas */}
        <Dialog open={isModalTambahOpen} onOpenChange={setIsModalTambahOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Baru</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleTambahTugas();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="judul">Judul Tugas</Label>
                <Input
                  id="judul"
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="jenis">Jenis Tugas</Label>
                <Select
                  value={formData.jenis}
                  onValueChange={val => setFormData({ ...formData, jenis: val })}
                  required
                >
                  <SelectTrigger id="jenis">
                    <SelectValue placeholder="Pilih Jenis Tugas" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisTugasOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gapoktan">Gapoktan</Label>
                <Select
                  value={formData.gapoktanId}
                  onValueChange={val => setFormData({ ...formData, gapoktanId: val })}
                  required
                >
                  <SelectTrigger id="gapoktan">
                    <SelectValue placeholder="Pilih Gapoktan" />
                  </SelectTrigger>
                  <SelectContent>
                    {gapoktanList.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
                <Input
                  id="tanggalMulai"
                  type="date"
                  value={formData.tanggalMulai}
                  onChange={e => setFormData({ ...formData, tanggalMulai: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lampiran">Lampiran (opsional)</Label>
                <Input
                  id="lampiran"
                  type="file"
                  onChange={e => setFormData({ ...formData, lampiran: e.target.files?.[0] || null })}
                  accept="image/*,application/pdf"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalTambahOpen(false)} disabled={submitting}>
                  Batal
                </Button>
                <Button type="submit" className="bg-green-700 text-white" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Daftar Tugas Aktif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Daftar Tugas Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-2">Memuat data...</span>
              </div>
            ) : tugas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada tugas yang dibuat
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Tugas</TableHead>
                    <TableHead>Gapoktan / Wilayah</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tugas.map((tugas) => (
                    <TableRow key={tugas.id}>
                      <TableCell className="font-medium">{tugas.judul}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{tugas.gapoktan_nama}</div>
                            {tugas.gapoktan_wilayah && (
                              <div className="text-xs text-gray-500">{tugas.gapoktan_wilayah}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {new Date(tugas.tanggal_dibuat).toLocaleDateString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {new Date(tugas.deadline).toLocaleDateString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(tugas.status)}>
                          {tugas.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLihatDetail(tugas)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTugas(tugas)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleHapusTugas(tugas.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 