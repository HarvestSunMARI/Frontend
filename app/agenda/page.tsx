'use client';

import { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Clock, MapPin, Users, BookOpen, CheckCircle, Briefcase } from 'lucide-react';
import { getTugasByGapoktan, getTugasByPenyuluh, Tugas } from '@/services/tugasService';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Calendar as BigCalendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

const localizer = momentLocalizer(require('moment'));

// Custom event component
function CustomEvent({ event }: { event: any }) {
  let icon = <Briefcase className="h-4 w-4 mr-1 text-white" />;
  if (event.resource.jenis === 'panen' || event.resource.jenis === 'harvest') icon = <BookOpen className="h-4 w-4 mr-1 text-white" />;
  if (event.resource.jenis === 'inspeksi' || event.resource.jenis === 'inspection') icon = <CheckCircle className="h-4 w-4 mr-1 text-white" />;
  if (event.resource.jenis === 'pelatihan' || event.resource.jenis === 'training') icon = <Users className="h-4 w-4 mr-1 text-white" />;
  if (event.resource.jenis === 'rapat' || event.resource.jenis === 'meeting') icon = <Calendar className="h-4 w-4 mr-1 text-white" />;
  return (
    <div className="flex items-center rounded-lg px-2 py-1 gap-1 shadow-sm hover:shadow-md transition bg-opacity-90 cursor-pointer">
      {icon}
      <span className="truncate font-medium text-white text-sm">{event.title}</span>
    </div>
  );
}

export default function AgendaPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Tugas | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const fetchTugas = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Tugas[] = [];
        if (user?.role === 'penyuluh') {
          data = await getTugasByPenyuluh();
        } else {
          data = await getTugasByGapoktan();
        }
        setTugas(data);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat tugas');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTugas();
  }, [user]);

  const getAgendaForDate = (date: Date) => {
    return tugas.filter(item => {
      const itemDate = item.tanggal_mulai ? new Date(item.tanggal_mulai) : new Date(item.deadline);
      return itemDate.toDateString() === date.toDateString();
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
      case 'rapat':
        return 'bg-blue-100 text-blue-800';
      case 'inspection':
      case 'inspeksi':
        return 'bg-green-100 text-green-800';
      case 'harvest':
      case 'panen':
        return 'bg-yellow-100 text-yellow-800';
      case 'training':
      case 'pelatihan':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Untuk dropdown bulan & tahun
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const years = useMemo(() => {
    const now = new Date();
    const arr = [];
    for (let y = now.getFullYear() - 3; y <= now.getFullYear() + 3; y++) arr.push(y);
    return arr;
  }, []);

  // Mapping tugas ke event kalender
  const events: CalendarEvent[] = tugas.map((item) => ({
    id: item.id,
    title: item.judul,
    start: item.tanggal_mulai ? parseISO(item.tanggal_mulai) : parseISO(item.deadline),
    end: item.deadline ? parseISO(item.deadline) : (item.tanggal_mulai ? parseISO(item.tanggal_mulai) : new Date()),
    allDay: true,
    resource: item,
  }));

  // Custom style for calendar
  const customCalendarStyle = {
    backgroundColor: '#f9fafb',
    borderRadius: '1rem',
    boxShadow: '0 2px 12px 0 rgba(34, 197, 94, 0.08)',
    padding: '1rem',
    border: 'none',
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-earth-brown-800">Tugas</h1>
            <p className="text-earth-brown-600 mt-1">Daftar tugas yang diberikan oleh penyuluh</p>
          </div>
          {/* Tombol tambah agenda bisa disembunyikan untuk gapoktan */}
        </div>

        {loading ? (
          <div>Memuat tugas...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div style={customCalendarStyle} className="flex-1 overflow-x-auto">
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                date={calendarDate}
                onNavigate={date => setCalendarDate(date)}
                style={{ height: 600, minWidth: 320 }}
                onSelectEvent={(event) => {
                  setSelectedEvent(event.resource);
                  setOpenDialog(true);
                }}
                components={{
                  event: CustomEvent,
                  toolbar: (props: any) => (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-2 gap-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => props.onNavigate('PREV')} className="rounded bg-earth-green-600 hover:bg-earth-green-700 text-white px-3 py-1 font-bold">{'<'}</button>
                        <button onClick={() => props.onNavigate('TODAY')} className="rounded bg-earth-brown-600 hover:bg-earth-brown-700 text-white px-3 py-1 font-bold">Bulan/Tahun Ini</button>
                        <div className="flex items-center gap-2 ml-2">
                          <select
                            className="rounded border px-2 py-1 text-earth-brown-800 bg-white"
                            value={calendarDate.getMonth()}
                            onChange={e => {
                              const newDate = new Date(calendarDate);
                              newDate.setMonth(Number(e.target.value));
                              setCalendarDate(newDate);
                            }}
                          >
                            {months.map((m, i) => (
                              <option key={m} value={i}>{m}</option>
                            ))}
                          </select>
                          <select
                            className="rounded border px-2 py-1 text-earth-brown-800 bg-white"
                            value={calendarDate.getFullYear()}
                            onChange={e => {
                              const newDate = new Date(calendarDate);
                              newDate.setFullYear(Number(e.target.value));
                              setCalendarDate(newDate);
                            }}
                          >
                            {years.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                        <button onClick={() => props.onNavigate('NEXT')} className="rounded bg-earth-green-600 hover:bg-earth-green-700 text-white px-3 py-1 font-bold">{'>'}</button>
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-earth-brown-800 text-center w-full md:w-auto">
                        {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                      </div>
                    </div>
                  ),
                  month: {
                    header: ({ label }: { label: string }) => (
                      <div className="text-earth-brown-700 font-semibold text-center text-base py-1">{label}</div>
                    ),
                  },
                }}
                messages={{
                  next: '>',
                  previous: '<',
                  today: 'Hari ini',
                  month: 'Bulan',
                  week: 'Minggu',
                  day: 'Hari',
                  agenda: 'Agenda',
                }}
                eventPropGetter={(event: any) => {
                  let bg = '#22c55e';
                  if (event.resource.jenis === 'panen' || event.resource.jenis === 'harvest') bg = '#eab308';
                  if (event.resource.jenis === 'inspeksi' || event.resource.jenis === 'inspection') bg = '#22d3ee';
                  if (event.resource.jenis === 'pelatihan' || event.resource.jenis === 'training') bg = '#a78bfa';
                  if (event.resource.jenis === 'rapat' || event.resource.jenis === 'meeting') bg = '#60a5fa';
                  return {
                    style: {
                      backgroundColor: bg,
                      color: '#fff',
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 2px 8px 0 rgba(34,197,94,0.10)',
                      fontWeight: 500,
                      fontSize: 14,
                      padding: '2px 8px',
                      transition: 'box-shadow 0.2s',
                    },
                  };
                }}
              />
            </div>
            {/* Tugas Mendatang */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow p-4">
                <div className="font-bold text-earth-brown-800 text-lg mb-3">Tugas Mendatang</div>
                <div className="space-y-3">
                  {tugas
                    .filter(item => {
                      const now = new Date();
                      const mulai = item.tanggal_mulai ? new Date(item.tanggal_mulai) : new Date(item.deadline);
                      return mulai >= now;
                    })
                    .sort((a, b) => {
                      const aDate = a.tanggal_mulai ? new Date(a.tanggal_mulai) : new Date(a.deadline);
                      const bDate = b.tanggal_mulai ? new Date(b.tanggal_mulai) : new Date(b.deadline);
                      return aDate.getTime() - bDate.getTime();
                    })
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="p-3 bg-earth-brown-50 rounded-lg cursor-pointer hover:bg-earth-green-100 transition"
                        onClick={() => { setSelectedEvent(item); setOpenDialog(true); }}>
                        <h4 className="font-medium text-earth-brown-800 text-sm">{item.judul}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-earth-brown-600" />
                          <span className="text-xs text-earth-brown-600">
                            {item.tanggal_mulai ? new Date(item.tanggal_mulai).toLocaleDateString('id-ID') : new Date(item.deadline).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <Badge className={`${getTypeColor(item.jenis)} text-xs mt-2`}>
                          {item.jenis}
                        </Badge>
                      </div>
                    ))}
                  {tugas.filter(item => {
                    const now = new Date();
                    const mulai = item.tanggal_mulai ? new Date(item.tanggal_mulai) : new Date(item.deadline);
                    return mulai >= now;
                  }).length === 0 && (
                    <div className="text-gray-400 text-sm text-center">Tidak ada tugas mendatang</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dialog detail tugas */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="transition-all duration-200">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-earth-green-600" />
                Detail Tugas
              </DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={
                    selectedEvent.jenis === 'panen' || selectedEvent.jenis === 'harvest' ? 'bg-yellow-400 text-white' :
                    selectedEvent.jenis === 'inspeksi' || selectedEvent.jenis === 'inspection' ? 'bg-cyan-400 text-white' :
                    selectedEvent.jenis === 'pelatihan' || selectedEvent.jenis === 'training' ? 'bg-purple-400 text-white' :
                    selectedEvent.jenis === 'rapat' || selectedEvent.jenis === 'meeting' ? 'bg-blue-400 text-white' :
                    'bg-green-500 text-white'
                  }>
                    {selectedEvent.jenis}
                  </Badge>
                  <span className="text-xs text-gray-500">{selectedEvent.status}</span>
                </div>
                <h3 className="font-semibold text-earth-brown-800 text-lg mb-1">{selectedEvent.judul}</h3>
                <p className="text-sm text-earth-brown-600 mb-2">{selectedEvent.deskripsi}</p>
                <div className="flex items-center gap-2 text-sm text-earth-brown-600">
                  <Clock className="h-4 w-4" />
                  <span><b>Mulai:</b> {selectedEvent.tanggal_mulai ? new Date(selectedEvent.tanggal_mulai).toLocaleString('id-ID') : '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-brown-600">
                  <Clock className="h-4 w-4" />
                  <span><b>Deadline:</b> {selectedEvent.deadline ? new Date(selectedEvent.deadline).toLocaleString('id-ID') : '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-brown-600">
                  <Users className="h-4 w-4" />
                  <span><b>Gapoktan:</b> {selectedEvent.gapoktan_nama || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-brown-600">
                  <MapPin className="h-4 w-4" />
                  <span><b>Wilayah:</b> {selectedEvent.gapoktan_wilayah || '-'}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Rapat</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {tugas.filter(item => item.jenis === 'meeting' || item.jenis === 'rapat').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Inspeksi</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {tugas.filter(item => item.jenis === 'inspection' || item.jenis === 'inspeksi').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Panen</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {tugas.filter(item => item.jenis === 'harvest' || item.jenis === 'panen').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Pelatihan</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {tugas.filter(item => item.jenis === 'training' || item.jenis === 'pelatihan').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}