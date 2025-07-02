'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, Shield, Bell, Key, MapPin, Save, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@supabase/supabase-js';
import { getUserProfile } from '@/services/userService';


export const WILAYAH_DIY = {
  "Bantul": {
    "Bambanglipuro": [
      "Sidomulyo", "Sumbermulyo", "Mulyodadi"
    ],
    "Banguntapan": [
      "Banguntapan", "Baturetno", "Jagalan", "Jambidan", "Potorono", "Singosaren", "Tamanan", "Wirokerten"
    ],
    "Dlingo": [
      "Dlingo", "Jatimulyo", "Mangunan", "Muntuk", "Temuwuh", "Terong"
    ],
    "Imogiri": [
      "Donomulyo", "Girirejo", "Karangtalun", "Kebonagung", "Selopamioro", "Sriharjo", "Tirtomulyo", "Wukirsari"
    ],
    "Jetis": [
      "Canden", "Patalan", "Sumber Agung"
    ],
    "Kasihan": [
      "Bangunjiwo", "Ngestiharjo", "Tamantirto", "Tirtonirmolo"
    ],
    "Kretek": [
      "Donotirto", "Parangtritis", "Tirtohargo", "Tirtomulyo"
    ],
    "Pajangan": [
      "Guwosari", "Sendangsari", "Triwidadi"
    ],
    "Pandak": [
      "Caturharjo", "Gilangharjo", "Kalirejo", "Panjangrejo", "Pleret", "Sumberagung", "Triharjo"
    ],
    "Piyungan": [
      "Situmulyo", "Srimartani", "Srimulyo"
    ],
    "Pleret": [
      "Bawuran", "Pleret", "Segoroyoso", "Wonokromo"
    ],
    "Pundong": [
      "Panjangsari", "Pundong", "Seloharjo", "Srihardono"
    ],
    "Sanden": [
      "Gadingsari", "Murtigading", "Srigading"
    ],
    "Sedayu": [
      "Argomulyo", "Argosari", "Argorejo", "Argosari", "Argodadi"
    ],
    "Sewon": [
      "Bangunharjo", "Pendowoharjo", "Panggungharjo"
    ],
    "Srandakan": [
      "Poncosari", "Trimurti"
    ]
  },
  "Gunungkidul": {
    "Gedangsari": [
      "Hargomulyo", "Mertelu", "Ngalang", "Tegalrejo"
    ],
    "Girisubo": [
      "Balong", "Banjarejo", "Karangawen", "Nglindur", "Pucung"
    ],
    "Karangmojo": [
      "Bejiharjo", "Gedangrejo", "Jatiayu", "Karangmojo", "Ngawis"
    ],
    "Ngawen": [
      "Bandung", "Jurangjero", "Ngawen", "Tancep"
    ],
    "Nglipar": [
      "Katongan", "Kedungpoh", "Natah", "Nglipar", "Pengkol"
    ],
    "Paliyan": [
      "Giring", "Karangasem", "Karangduwet", "Pampang", "Paliyan"
    ],
    "Panggang": [
      "Girisuko", "Girikarto", "Girimulyo", "Giriwungu", "Kemadang"
    ],
    "Patuk": [
      "Beji", "Bunder", "Nglegi", "Patuk", "Pengkok", "Putat", "Salam"
    ],
    "Playen": [
      "Bleberan", "Getas", "Logandeng", "Ngleri", "Playen", "Sumbermulyo"
    ],
    "Ponjong": [
      "Bedoyo", "Genjahan", "Karangasem", "Ponjong", "Sawahan"
    ],
    "Purwosari": [
      "Giritirto", "Girisuko", "Purwosari"
    ],
    "Rongkop": [
      "Gombang", "Melikan", "Petir", "Rongkop", "Semugih"
    ],
    "Saptosari": [
      "Jetis", "Kanigoro", "Kepek", "Krakal", "Ngestirejo", "Planjan", "Saptosari"
    ],
    "Semanu": [
      "Candirejo", "Dadapayu", "Ngeposari", "Pacarejo", "Semanu"
    ],
    "Semin": [
      "Bulurejo", "Kalitekuk", "Karangsari", "Kemejing", "Pundungsari", "Semin"
    ],
    "Tanjungsari": [
      "Banjarejo", "Hargosari", "Kemadang", "Ngestirejo", "Tepus"
    ],
    "Tepus": [
      "Giriwungu", "Purwodadi", "Sumberwungu", "Tepus"
    ],
    "Wonosari": [
      "Bondalem", "Kepek", "Mulo", "Piyaman", "Selang", "Wonosari", "Workodadi"
    ]
  },
  "Kulon Progo": {
    "Galur": [
      "Banaran", "Brosot", "Karangsewu", "Nomporejo", "Tirto"
    ],
    "Girimulyo": [
      "Jatimulyo", "Purwosari", "Wonosari"
    ],
    "Kalibawang": [
      "Banjararum", "Banjarasri", "Banjarharjo", "Banjaroya"
    ],
    "Kokap": [
      "Hargomulyo", "Hargotirto", "Kalirejo", "Krembangan"
    ],
    "Lendah": [
      "Banguncipto", "Gulurejo", "Ngentakrejo", "Ngroto", "Sidorejo"
    ],
    "Nanggulan": [
      "Banjararum", "Donomulyo", "Kebonharjo", "Kedungsari", "Wijimulyo"
    ],
    "Panjatan": [
      "Bojong", "Cerme", "Gotakan", "Krembangan", "Panjatan"
    ],
    "Pengasih": [
      "Karangsari", "Kedungsari", "Pengasih", "Sendangsari"
    ],
    "Samigaluh": [
      "Banjarsari", "Gerbosari", "Ngargosari", "Purwoharjo", "Sidoharjo"
    ],
    "Sentolo": [
      "Banguncipto", "Demangrejo", "Sentolo", "Sukoreno"
    ],
    "Temon": [
      "Balak", "Jangkaran", "Kalidengen", "Karangwuni", "Kebonrejo", "Kedundang", "Palihan", "Plumbon", "Sindutan", "Temon Kulon", "Temon Wetan"
    ],
    "Wates": [
      "Bendungan", "Giripeni", "Karangwuluh", "Kulur", "Ngestiharjo", "Wates"
    ]
  },
  "Sleman": {
    "Berbah": [
      "Jogotirto", "Kalitirto", "Sendangtirto", "Tegaltirto"
    ],
    "Cangkringan": [
      "Argomulyo", "Glagaharjo", "Umbulharjo", "Wukirsari"
    ],
    "Depok": [
      "Caturtunggal", "Condongcatur", "Maguwoharjo"
    ],
    "Gamping": [
      "Ambarketawang", "Balecatur", "Banyuraden", "Nogotirto"
    ],
    "Godean": [
      "Sidoluhur", "Sidomulyo", "Sidorejo", "Sidoarum", "Sidoagung"
    ],
    "Kalasan": [
      "Purwomartani", "Selomartani", "Tamanmartani", "Tirtomartani"
    ],
    "Minggir": [
      "Sendangagung", "Sendangrejo", "Sendangsari"
    ],
    "Mlati": [
      "Sendangadi", "Sinduadi", "Tlogoadi"
    ],
    "Moyudan": [
      "Sumbersari", "Sumberagung", "Sumberarum", "Sumberrahayu"
    ],
    "Ngaglik": [
      "Donoharjo", "Minomartani", "Sariharjo", "Sukoharjo"
    ],
    "Ngemplak": [
      "Bimomartani", "Caturharjo", "Purwobinangun", "Sindumartani", "Widodomartani"
    ],
    "Pakem": [
      "Candibinangun", "Hargobinangun", "Pakembinangun", "Purwobinangun"
    ],
    "Prambanan": [
      "Bokoharjo", "Madurejo", "Sambirejo", "Sumberharjo", "Wukirharjo"
    ],
    "Seyegan": [
      "Margokaton", "Margomulyo", "Margosari", "Margoagung"
    ],
    "Sleman": [
      "Caturharjo", "Pandowoharjo", "Tridadi", "Triharjo"
    ],
    "Tempel": [
      "Bangunkerto", "Lumbungrejo", "Margorejo", "Mororejo", "Sumberrejo", "Tirtoadi"
    ],
    "Turi": [
      "Bangunkerto", "Donokerto", "Girikerto", "Purwobinangun"
    ]
  },
  "Kota Yogyakarta": {
    "Danurejan": [
      "Bausasran", "Tegal Panggung", "Suryatmajan"
    ],
    "Gedongtengen": [
      "Pringgokusuman", "Sosromenduran"
    ],
    "Gondokusuman": [
      "Baciro", "Demangan", "Klitren", "Kotabaru", "Tegal Panggung"
    ],
    "Gondomanan": [
      "Ngupasan", "Prawirodirjan"
    ],
    "Jetis": [
      "Cokrodiningratan", "Gowongan", "Jetis"
    ],
    "Kotagede": [
      "Jagalan", "Purbayan", "Rejowinangun"
    ],
    "Kraton": [
      "Kadipaten", "Panembahan", "Patehan"
    ],
    "Mantrijeron": [
      "Gedongkiwo", "Mantrijeron", "Suryodiningratan"
    ],
    "Mergangsan": [
      "Brontokusuman", "Keparakan", "Wirogunan"
    ],
    "Ngampilan": [
      "Notoprajan", "Ngampilan"
    ],
    "Pakualaman": [
      "Gunungketur", "Purwokinanti"
    ],
    "Tegalrejo": [
      "Karangwaru", "Kricak", "Tegalrejo"
    ],
    "Umbulharjo": [
      "Muja Muju", "Pandeyan", "Prenggan", "Semaki", "Sorosutan", "Tahunan", "Warungboto"
    ],
    "Wirobrajan": [
      "Pakuncen", "Patangpuluhan", "Wirobrajan"
    ]
  }
};

export default function PengaturanAkunPage() {
  const { user, switchRole } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    wilayah: user?.wilayah || '',
    desa: user?.desa || '',
    kabupaten: user?.kabupaten || '',
    kecamatan: user?.kecamatan || '',
    avatar: user?.avatar || ''
  });
  const [kabupaten, setKabupaten] = useState(formData.kabupaten || '');
  const [kecamatan, setKecamatan] = useState(formData.kecamatan || '');
  const [desa, setDesa] = useState(formData.desa || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [uploading, setUploading] = useState(false);

  const kecamatanList = kabupaten ? Object.keys(WILAYAH_DIY[kabupaten as keyof typeof WILAYAH_DIY]) : [];
  const desaList =
    kabupaten && kecamatan
      ? (
          WILAYAH_DIY[kabupaten as keyof typeof WILAYAH_DIY] as Record<string, string[]>
        )[kecamatan] || []
      : [];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.id) {
        try {
          const freshUser = await getUserProfile(user.id);
          setFormData({
            name: freshUser.name || '',
            email: freshUser.email || '',
            phone: freshUser.phone || '',
            wilayah: freshUser.wilayah || '',
            desa: freshUser.desa || '',
            kabupaten: freshUser.kabupaten || '',
            kecamatan: freshUser.kecamatan || '',
            avatar: freshUser.avatar || ''
          });
          setKabupaten(freshUser.kabupaten || '');
          setKecamatan(freshUser.kecamatan || '');
          setDesa(freshUser.desa || '');
          setAvatarPreview(freshUser.avatar || null);
        } catch (err) {
          toast({ title: 'Error', description: 'Gagal mengambil data profil', variant: 'destructive' });
        }
      }
    };
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'user-id': user.id
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          wilayah: formData.wilayah,
          desa: formData.desa,
          kabupaten: kabupaten,
          kecamatan: kecamatan,
          avatar_url: formData.avatar
        }),
      });
      if (!response.ok) {
        throw new Error('Gagal menyimpan perubahan');
      }
      const updatedUser = await getUserProfile(user.id);
      toast({
        title: 'Sukses',
        description: 'Profil berhasil diperbarui',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal menyimpan perubahan',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Fungsi upload avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleAvatarChange called');
    const file = e.target.files?.[0];
    console.log('file:', file);
    if (!file || !user) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      // Inisialisasi Supabase di dalam fungsi (hanya berjalan di client)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
      }
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const filePath = `user-${user.id}/${file.name}`;
      const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      console.log('Avatar publicUrl:', publicUrlData.publicUrl);
      setFormData(f => ({ ...f, avatar: publicUrlData.publicUrl }));
      toast({ title: 'Sukses', description: 'Foto profil berhasil diupload' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-earth-brown-800">Pengaturan Akun</h1>
          <p className="text-earth-brown-600 mt-1">Kelola profil dan preferensi akun Anda</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferensi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-earth-green-600" />
                  Informasi Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="mb-4 flex flex-col items-center">
                  <img
                    src={avatarPreview || '/default-avatar.png'}
                    alt="Foto Profil"
                    className="rounded-full w-24 h-24 object-cover border mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                    className="mb-2"
                  />
                  <span className="text-xs text-gray-500">JPG, PNG atau GIF. Maksimal 2MB.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email tidak dapat diubah
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Wilayah</Label>
                    {formData.wilayah ? (
                      <Input value={formData.wilayah} readOnly disabled className="bg-gray-50" />
                    ) : (
                      <Input value={formData.wilayah} onChange={e => setFormData(f => ({ ...f, wilayah: e.target.value }))} placeholder="Isi wilayah" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Kabupaten</Label>
                    {formData.kabupaten ? (
                      <Input value={formData.kabupaten} readOnly disabled className="bg-gray-50" />
                    ) : (
                      <Input value={formData.kabupaten} onChange={e => setFormData(f => ({ ...f, kabupaten: e.target.value }))} placeholder="Isi kabupaten" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Kecamatan</Label>
                    {formData.kecamatan ? (
                      <Input value={formData.kecamatan} readOnly disabled className="bg-gray-50" />
                    ) : (
                      <Input value={formData.kecamatan} onChange={e => setFormData(f => ({ ...f, kecamatan: e.target.value }))} placeholder="Isi kecamatan" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Desa</Label>
                    {formData.desa ? (
                      <Input value={formData.desa} readOnly disabled className="bg-gray-50" />
                    ) : (
                      <Input value={formData.desa} onChange={e => setFormData(f => ({ ...f, desa: e.target.value }))} placeholder="Isi desa" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center gap-4">
                    <Input id="role" value={user.role.replace('_', ' ')} readOnly className="capitalize" />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const roles = ['konsultan_tani', 'penyuluh', 'admin'];
                        const currentIndex = roles.indexOf(user.role);
                        const nextRole = roles[(currentIndex + 1) % roles.length];
                        switchRole(nextRole as any);
                      }}
                    >
                      Switch Role (Demo)
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-earth-green-600 hover:bg-earth-green-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Key className="h-5 w-5 text-earth-green-600" />
                  Ubah Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Password Saat Ini</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password Baru</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>

                <Button className="bg-earth-green-600 hover:bg-earth-green-700">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-earth-green-600" />
                  Keamanan Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-earth-brown-800">Two-Factor Authentication</h4>
                    <p className="text-sm text-earth-brown-600">Tingkatkan keamanan dengan 2FA</p>
                  </div>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-earth-brown-800">Login Sessions</h4>
                    <p className="text-sm text-earth-brown-600">Kelola session aktif</p>
                  </div>
                  <Button variant="outline">Lihat Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-earth-green-600" />
                  Pengaturan Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { id: 'weather', label: 'Peringatan Cuaca', description: 'Notifikasi cuaca ekstrem' },
                    { id: 'harvest', label: 'Jadwal Panen', description: 'Pengingat waktu panen' },
                    { id: 'tasks', label: 'Tugas Baru', description: 'Notifikasi tugas yang diberikan' },
                    { id: 'reports', label: 'Laporan', description: 'Update status laporan' },
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-earth-brown-800">{notification.label}</h4>
                        <p className="text-sm text-earth-brown-600">{notification.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-earth-green-600 rounded border-earth-brown-300"
                      />
                    </div>
                  ))}
                </div>

                <Button className="bg-earth-green-600 hover:bg-earth-green-700">
                  Simpan Pengaturan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-earth-green-600" />
                  Preferensi Aplikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-earth-brown-800">Bahasa</h4>
                      <p className="text-sm text-earth-brown-600">Pilih bahasa interface</p>
                    </div>
                    <select className="border border-earth-brown-300 rounded-md px-3 py-2">
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-earth-brown-800">Zona Waktu</h4>
                      <p className="text-sm text-earth-brown-600">Pengaturan zona waktu</p>
                    </div>
                    <select className="border border-earth-brown-300 rounded-md px-3 py-2">
                      <option value="Asia/Jakarta">WIB (Jakarta)</option>
                      <option value="Asia/Makassar">WITA (Makassar)</option>
                      <option value="Asia/Jayapura">WIT (Jayapura)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-earth-brown-800">Mode Gelap</h4>
                      <p className="text-sm text-earth-brown-600">Tema gelap untuk interface</p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-earth-green-600 rounded border-earth-brown-300"
                    />
                  </div>
                </div>

                <Button className="bg-earth-green-600 hover:bg-earth-green-700">
                  Simpan Preferensi
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}