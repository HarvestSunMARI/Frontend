'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Users,
  ClipboardList,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Activity,
  FileText,
  CheckCircle
} from 'lucide-react';
import { regionalPerformanceData, weatherAlerts, tasks, reports, systemLogs } from '@/data/sampleData';

export function PenyuluhDashboard() {
  const totalConsultants = 8;
  const activeTasks = tasks.filter(task => task.status !== 'completed').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingReports = reports.filter(report => report.status === 'submitted').length;

  const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

  const taskStatusData = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#f97316' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#eab308' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#22c55e' }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Konsultan</CardTitle>
            <Users className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{totalConsultants}</div>
            <p className="text-xs text-earth-brown-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              6 aktif hari ini
            </p>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Aktif</CardTitle>
            <ClipboardList className="h-4 w-4 text-earth-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-yellow-700">{activeTasks}</div>
            <p className="text-xs text-earth-brown-600">
              {completedTasks} tugas selesai
            </p>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laporan Masuk</CardTitle>
            <FileText className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{pendingReports}</div>
            <p className="text-xs text-earth-brown-600">
              Menunggu review
            </p>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wilayah Binaan</CardTitle>
            <MapPin className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">4</div>
            <p className="text-xs text-earth-brown-600">Kabupaten/Kota</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800">Performa Regional</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="performance" fill="#22c55e" />
                <Bar dataKey="target" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800">Status Tugas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weather Alerts */}
      <Card className="harvest-card">
        <CardHeader>
          <CardTitle className="text-earth-brown-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-earth-yellow-600" />
            Peringatan Cuaca Regional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-earth-yellow-50 rounded-lg border border-earth-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.severity === 'high' ? 'text-red-500' : 
                    alert.severity === 'medium' ? 'text-earth-yellow-600' : 'text-earth-green-600'
                  }`} />
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="font-medium text-earth-brown-800 mb-1">{alert.location}</h4>
                <p className="text-sm text-earth-brown-600">{alert.message}</p>
                <p className="text-xs text-earth-brown-500 mt-2">
                  {alert.timestamp.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultant Activity */}
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-earth-green-600" />
              Aktivitas Konsultan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-earth-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-earth-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-earth-brown-800">{log.action}</p>
                    <p className="text-sm text-earth-brown-600">{log.user}</p>
                    <p className="text-xs text-earth-brown-500 mt-1">
                      {log.timestamp.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-earth-green-600" />
              Laporan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-earth-brown-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-earth-brown-800">{report.title}</h4>
                    <p className="text-sm text-earth-brown-600">{report.author} • {report.location}</p>
                    <p className="text-xs text-earth-brown-500 mt-1">
                      {report.createdAt.toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <Badge variant={
                    report.status === 'submitted' ? 'default' :
                    report.status === 'reviewed' ? 'secondary' : 'outline'
                  }>
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}