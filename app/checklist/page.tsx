'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Plus, Calendar, AlertTriangle } from 'lucide-react';
import { checklistItems } from '@/data/sampleData';

export default function ChecklistPage() {
  const [items, setItems] = useState(checklistItems);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const filteredItems = items.filter(item => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (date: Date) => {
    return new Date() > date;
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-earth-brown-800">Checklist</h1>
            <p className="text-earth-brown-600 mt-1">Kelola tugas dan checklist harian</p>
          </div>
          <Button className="bg-earth-green-600 hover:bg-earth-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Item
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="harvest-card mb-6">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-earth-green-600" />
              Progress Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-earth-brown-800">
                  {completedCount} dari {totalCount} tugas selesai
                </span>
                <span className="text-sm text-earth-brown-600">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-earth-green-700">{completedCount}</p>
                  <p className="text-sm text-earth-brown-600">Selesai</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-earth-yellow-700">{totalCount - completedCount}</p>
                  <p className="text-sm text-earth-brown-600">Tertunda</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">
                    {items.filter(item => !item.completed && isOverdue(item.dueDate)).length}
                  </p>
                  <p className="text-sm text-earth-brown-600">Terlambat</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'Semua', count: items.length },
            { key: 'pending', label: 'Tertunda', count: items.filter(item => !item.completed).length },
            { key: 'completed', label: 'Selesai', count: completedCount }
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'default' : 'outline'}
              onClick={() => setFilter(filterOption.key as 'all' | 'pending' | 'completed')}
              className={filter === filterOption.key ? 'bg-earth-green-600 hover:bg-earth-green-700' : ''}
            >
              {filterOption.label} ({filterOption.count})
            </Button>
          ))}
        </div>

        {/* Checklist Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className={`harvest-card ${item.completed ? 'opacity-75' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      item.completed 
                        ? 'bg-earth-green-600 border-earth-green-600 text-white' 
                        : 'border-earth-brown-300 hover:border-earth-green-600'
                    }`}
                  >
                    {item.completed && <CheckCircle className="h-3 w-3" />}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      item.completed 
                        ? 'line-through text-earth-brown-500' 
                        : 'text-earth-brown-800'
                    }`}>
                      {item.task}
                    </h3>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-earth-brown-600">
                        <Calendar className="h-4 w-4" />
                        {item.dueDate.toLocaleDateString('id-ID')}
                        {isOverdue(item.dueDate) && !item.completed && (
                          <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                        )}
                      </div>
                      
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      
                      {isOverdue(item.dueDate) && !item.completed && (
                        <Badge variant="destructive">
                          Terlambat
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="harvest-card">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-earth-brown-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-earth-brown-800 mb-2">
                Tidak ada item checklist
              </h3>
              <p className="text-earth-brown-600">
                {filter === 'completed' && 'Belum ada tugas yang selesai.'}
                {filter === 'pending' && 'Semua tugas sudah selesai!'}
                {filter === 'all' && 'Mulai dengan menambahkan item checklist baru.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}