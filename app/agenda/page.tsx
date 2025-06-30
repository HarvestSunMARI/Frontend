'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Clock, MapPin, Users } from 'lucide-react';
import { agendaItems } from '@/data/sampleData';

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const getAgendaForDate = (date: Date) => {
    return agendaItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === date.toDateString();
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'harvest': return 'bg-yellow-100 text-yellow-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-earth-brown-800">Agenda</h1>
            <p className="text-earth-brown-600 mt-1">Kelola jadwal dan kegiatan harian</p>
          </div>
          <Button className="bg-earth-green-600 hover:bg-earth-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Agenda
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-2 harvest-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-earth-green-600" />
                  Kalender Agenda
                </CardTitle>
                <div className="flex gap-2">
                  {['day', 'week', 'month'].map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode(mode as 'day' | 'week' | 'month')}
                      className={viewMode === mode ? 'bg-earth-green-600 hover:bg-earth-green-700' : ''}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendaItems.map((item) => (
                  <div key={item.id} className="p-4 bg-earth-green-50 rounded-lg border border-earth-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-earth-brown-800">{item.title}</h3>
                        <p className="text-sm text-earth-brown-600 mt-1">{item.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-earth-brown-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {item.date.toLocaleDateString('id-ID')} • {item.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {item.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="harvest-card">
            <CardHeader>
              <CardTitle className="text-earth-brown-800">Agenda Mendatang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agendaItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-3 bg-earth-brown-50 rounded-lg">
                    <h4 className="font-medium text-earth-brown-800 text-sm">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-earth-brown-600" />
                      <span className="text-xs text-earth-brown-600">
                        {item.date.toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <Badge className={`${getTypeColor(item.type)} text-xs mt-2`}>
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

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
                    {agendaItems.filter(item => item.type === 'meeting').length}
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
                    {agendaItems.filter(item => item.type === 'inspection').length}
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
                    {agendaItems.filter(item => item.type === 'harvest').length}
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
                  <p className="text-sm text-earth-brown-600">Training</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {agendaItems.filter(item => item.type === 'training').length}
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