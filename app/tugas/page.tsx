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
  getKonsultanList, 
  createTugas, 
  getTugasByPenyuluh, 
  deleteTugas,
  getTugasById,
  Konsultan,
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
  const [konsultanList, setKonsultanList] = useState<Konsultan[]>([]);
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState<Tugas | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    jenis: "",
    konsultanId: "",
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
      const [tugasData, konsultanData] = await Promise.all([
        getTugasByPenyuluh(),
        getKonsultanList()
      ]);
      setTugas(tugasData);
      setKonsultanList(konsultanData);
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
    if (!formData.judul || !formData.konsultanId || !formData.deadline || !formData.jenis) {
      toast({
        title: "Error",
        description: "Judul, jenis tugas, konsultan, dan deadline harus diisi",
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
        konsultan_id: formData.konsultanId,
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
        konsultanId: "",
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
              <ClipboardList className="h-6 w-6 text-earth-green-600" /> Tugas untuk Konsultan
            </h1>
            <p className="text-earth-brown-700">Kelola dan distribusikan tugas ke konsultan tani di wilayah Anda.</p>
          </div>
          <Dialog open={isModalTambahOpen} onOpenChange={setIsModalTambahOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow">
                <Plus className="h-5 w-5" /> Tambah Tugas
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Tugas Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="judul">Judul Tugas *</Label>
                  <Input
                    id="judul"
                    value={formData.judul}
                    onChange={(e) => setFormData({...formData, judul: e.target.value})}
                    placeholder="Masukkan judul tugas"
                  />
                </div>
                <div>
                  <Label htmlFor="deskripsi">Deskripsi Tugas</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    placeholder="Masukkan deskripsi tugas"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="jenis">Jenis Tugas *</Label>
                  <Select
                    value={formData.jenis}
                    onValueChange={val => setFormData({ ...formData, jenis: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis tugas" />
                    </SelectTrigger>
                    <SelectContent>
                      {jenisTugasOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="konsultan">Pilih Konsultan *</Label>
                  <Select
                    value={formData.konsultanId}
                    onValueChange={val => setFormData({ ...formData, konsultanId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih konsultan" />
                    </SelectTrigger>
                    <SelectContent>
                      {konsultanList.map(k => (
                        <SelectItem key={k.id} value={k.id}>
                          {k.name} {k.wilayah ? `- ${k.wilayah}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
                    <Input
                      id="tanggalMulai"
                      type="date"
                      value={formData.tanggalMulai}
                      onChange={(e) => setFormData({...formData, tanggalMulai: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="lampiran">Lampiran (Opsional)</Label>
                  <Input
                    id="lampiran"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={e => setFormData({ ...formData, lampiran: e.target.files?.[0] || null })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsModalTambahOpen(false)} disabled={submitting}>
                    Batal
                  </Button>
                  <Button onClick={handleTambahTugas} className="bg-green-600 hover:bg-green-700" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Tugas'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
                    <TableHead>Konsultan / Wilayah</TableHead>
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
                            <div className="font-medium">{tugas.konsultan_nama}</div>
                            {tugas.konsultan_wilayah && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {tugas.konsultan_wilayah}
                              </div>
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

        {/* Modal Detail Tugas */}
        <Dialog open={isModalDetailOpen} onOpenChange={setIsModalDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Tugas</DialogTitle>
            </DialogHeader>
            {selectedTugas && (
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Judul Tugas</Label>
                  <p className="text-lg font-semibold">{selectedTugas.judul}</p>
                </div>
                <div>
                  <Label className="font-medium">Konsultan</Label>
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedTugas.konsultan_nama} {selectedTugas.konsultan_wilayah && `- ${selectedTugas.konsultan_wilayah}`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Tanggal Dibuat</Label>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedTugas.tanggal_dibuat).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Deadline</Label>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedTugas.deadline).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedTugas.status)}>
                    {selectedTugas.status}
                  </Badge>
                </div>
                {selectedTugas.deskripsi && (
                  <div>
                    <Label className="font-medium">Deskripsi</Label>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedTugas.deskripsi}
                    </p>
                  </div>
                )}
                {selectedTugas.lampiran_url && (
                  <div>
                    <Label className="font-medium">Lampiran</Label>
                    <a 
                      href={selectedTugas.lampiran_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Lihat Lampiran
                    </a>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 