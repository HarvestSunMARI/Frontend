'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  FileText,
  Map,
  Settings,
  Users,
  ClipboardList,
  Shield,
  Activity,
  Database,
  Menu,
  X,
  Sprout,
  MessageCircle,
  MapPin
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  // Konsultan Tani
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/konsultan', roles: ['konsultan_tani'] },
  { id: 'agenda', label: 'Agenda', icon: Calendar, href: '/agenda', roles: ['konsultan_tani'] },
  { id: 'checklist', label: 'Checklist', icon: CheckSquare, href: '/checklist', roles: ['konsultan_tani'] },
  { id: 'laporan', label: 'Laporan', icon: FileText, href: '/laporan', roles: ['konsultan_tani', 'penyuluh'] },
  { id: 'peta-lahan', label: 'Peta Lahan', icon: Map, href: '/peta-lahan', roles: ['konsultan_tani'] },
  { id: 'pengaturan-akun', label: 'Pengaturan Akun', icon: Settings, href: '/pengaturan-akun', roles: ['konsultan_tani', 'penyuluh'] },
  { id: 'chatbot', label: 'Chatbot', icon: MessageCircle, href: '/chatbot', roles: ['konsultan_tani'] },
  
  // Penyuluh
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/penyuluh', roles: ['penyuluh'] },
  { id: 'wilayah', label: 'Manajemen Wilayah', icon: MapPin, href: '/wilayah', roles: ['penyuluh'] },
  { id: 'konsultan-tani', label: 'Konsultan Tani', icon: Users, href: '/konsultan-tani', roles: ['penyuluh'] },
  { id: 'tugas', label: 'Tugas', icon: ClipboardList, href: '/tugas', roles: ['penyuluh'] },
  { id: 'peta-wilayah', label: 'Peta Wilayah', icon: Map, href: '/peta-wilayah', roles: ['penyuluh'] },
  { id: 'chatbot', label: 'Chatbot', icon: MessageCircle, href: '/chatbot', roles: ['penyuluh'] },
  
  // Admin
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin', roles: ['admin'] },
  { id: 'manajemen-pengguna', label: 'Manajemen Pengguna', icon: Users, href: '/admin/users', roles: ['admin'] },
  { id: 'roles-permissions', label: 'Roles & Permissions', icon: Shield, href: '/roles-permissions', roles: ['admin'] },
  { id: 'log-aktivitas', label: 'Log Aktivitas Sistem', icon: Activity, href: '/log-aktivitas', roles: ['admin'] },
  { id: 'data-overview', label: 'Data Overview', icon: Database, href: '/data-overview', roles: ['admin'] },
  { id: 'pengaturan-platform', label: 'Pengaturan Platform', icon: Settings, href: '/pengaturan-platform', roles: ['admin'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const userItems = sidebarItems.filter(item => item.roles.includes(user.role));

  return (
    <div className={cn(
      "bg-white border-r border-earth-brown-200 transition-all duration-300 flex flex-col h-screen",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-earth-brown-200">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-earth-green-600" />
            <span className="font-bold text-xl text-earth-green-700">HarvestSun</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-earth-brown-200">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-earth-green-100 flex items-center justify-center">
            <span className="text-earth-green-700 font-semibold text-sm">
              {user.name.charAt(0)}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-earth-brown-800 truncate">{user.name}</p>
              <p className="text-sm text-earth-brown-600 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {userItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                    isActive 
                      ? "bg-earth-green-500 text-white hover:bg-earth-green-600" 
                      : "text-earth-brown-700 hover:bg-earth-green-100 hover:text-earth-green-700",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isCollapsed ? "h-6 w-6" : "")} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-earth-brown-200">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Activity className={cn("h-5 w-5", isCollapsed ? "h-6 w-6" : "")} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}