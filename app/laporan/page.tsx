'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Search, Filter, Download, Eye } from 'lucide-react';
import { reports } from '@/data/sampleData';

export default function LaporanPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'submitted' | 'reviewed'>('all');

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'harvest': return 'bg-green-100 text-green-800';
      case 'weather': return 'bg-blue-100 text-blue-800';
      case 'pest': return 'bg-red-100 text-red-800';
      case 'soil': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-earth-brown-800">Laporan</h1>
            <p className="text-earth-brown-600 mt-1">Kelola laporan lapangan dan dokumentasi</p>
          </div>
          <Button className="bg-earth-green-600 hover:bg-earth-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Buat Laporan
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-earth-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-earth-green-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Total Laporan</p>
                  <p className="text-2xl font-bold text-earth-brown-800">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Draft</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {reports.filter(r => r.status === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Submitted</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {reports.filter(r => r.status === 'submitted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Reviewed</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {reports.filter(r => r.status === 'reviewed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Daftar Laporan</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Semua', count: reports.length },
                { key: 'draft', label: 'Draft', count: reports.filter(r => r.status === 'draft').length },
                { key: 'submitted', label: 'Submitted', count: reports.filter(r => r.status === 'submitted').length },
                { key: 'reviewed', label: 'Reviewed', count: reports.filter(r => r.status === 'reviewed').length }
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? 'default' : 'outline'}
                  onClick={() => setFilter(filterOption.key as 'all' | 'draft' | 'submitted' | 'reviewed')}
                  className={filter === filterOption.key ? 'bg-earth-green-600 hover:bg-earth-green-700' : ''}
                >
                  {filterOption.label} ({filterOption.count})
                </Button>
              ))}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="harvest-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-earth-brown-800">{report.title}</h3>
                          <Badge className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-earth-brown-600 mb-3">
                          {report.content.substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-earth-brown-600">
                          <span>Penulis: {report.author}</span>
                          <span>Lokasi: {report.location}</span>
                          <span>Tanggal: {report.createdAt.toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Lihat
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="harvest-card">
                <CardHeader>
                  <CardTitle className="text-earth-brown-800">Laporan per Tipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['harvest', 'weather', 'pest', 'soil'].map((type) => {
                      const count = reports.filter(r => r.type === type).length;
                      const percentage = (count / reports.length) * 100;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-earth-brown-800 capitalize">{type}</span>
                            <span className="text-sm text-earth-brown-600">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-earth-brown-200 rounded-full h-2">
                            <div 
                              className="bg-earth-green-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="harvest-card">
                <CardHeader>
                  <CardTitle className="text-earth-brown-800">Status Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['draft', 'submitted', 'reviewed'].map((status) => {
                      const count = reports.filter(r => r.status === status).length;
                      const percentage = (count / reports.length) * 100;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-earth-brown-800 capitalize">{status}</span>
                            <span className="text-sm text-earth-brown-600">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-earth-brown-200 rounded-full h-2">
                            <div 
                              className="bg-earth-green-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}