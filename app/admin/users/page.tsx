"use client";

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { WILAYAH_DIY } from '@/app/pengaturan-akun/page';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  wilayah?: string;
  desa?: string;
}

const roleColor: Record<string, string> = {
  admin: 'bg-blue-100 text-blue-700',
  penyuluh: 'bg-green-100 text-green-700',
  konsultan_tani: 'bg-yellow-100 text-yellow-700',
};

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'penyuluh', label: 'Penyuluh' },
  { value: 'konsultan_tani', label: 'Konsultan Tani' },
];

const allDesa: string[] = [];
Object.values(WILAYAH_DIY).forEach((kab: any) => {
  Object.values(kab).forEach((kec: any) => {
    allDesa.push(...(kec as string[]));
  });
});
const purwomartaniWilayah = ['Purwomartani 1', 'Purwomartani 2', 'Purwomartani 3'];

// Generate opsi wilayah untuk semua desa
function getWilayahOptions(desa: string) {
  if (!desa) return [];
  return [1, 2, 3].map(n => `${desa} ${n}`);
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const [editWilayah, setEditWilayah] = useState<string>('');
  const [editDesa, setEditDesa] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'desa' | 'role' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setEditRole(user.role);
    setEditWilayah(user.wilayah || '');
    setEditDesa(user.desa || '');
  };

  const handleCancel = () => {
    setEditId(null);
    setEditRole('');
    setEditWilayah('');
    setEditDesa('');
  };

  const handleSave = async (user: User) => {
    setSaving(true);
    try {
      const wilayahToSave = editWilayah;
      const res = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editRole, wilayah: wilayahToSave, desa: editDesa }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, role: editRole, wilayah: wilayahToSave, desa: editDesa } : u));
        setEditId(null);
        setEditRole('');
        setEditWilayah('');
        setEditDesa('');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Yakin ingin menghapus user ${user.name}?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== user.id));
      }
    } finally {
      setSaving(false);
    }
  };

  let displayedUsers = [...users];
  if (sortBy) {
    displayedUsers.sort((a, b) => {
      const valA = (a[sortBy] || '').toLowerCase();
      const valB = (b[sortBy] || '').toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-8xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-earth-brown-800">Manajemen Pengguna</h1>
          {/* <button className="bg-earth-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-earth-green-700 transition">Tambah User</button> */}
        </div>
        <div className="bg-white rounded-xl shadow border overflow-x-auto">
          <table className="min-w-full divide-y divide-earth-brown-200">
            <thead className="bg-earth-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-earth-brown-600 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                  if (sortBy === 'name') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  setSortBy('name');
                }}>
                  Nama {sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-earth-brown-600 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                  if (sortBy === 'desa') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  setSortBy('desa');
                }}>
                  Desa {sortBy === 'desa' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-earth-brown-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-earth-brown-600 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                  if (sortBy === 'role') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                  setSortBy('role');
                }}>
                  Role {sortBy === 'role' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-earth-brown-600 uppercase tracking-wider">Wilayah</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-earth-brown-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-earth-brown-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-earth-brown-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-earth-brown-400">Tidak ada data pengguna</td></tr>
              ) : (
                displayedUsers.map((user, idx) => (
                  <tr key={user.id} className={idx % 2 === 0 ? 'bg-earth-green-50/40' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-earth-brown-800">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-earth-brown-700">
                      {editId === user.id ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={editDesa}
                          onChange={e => {
                            setEditDesa(e.target.value);
                            setEditWilayah(''); // reset wilayah saat desa berubah
                          }}
                          disabled={saving}
                        >
                          <option value="">Pilih desa</option>
                          {allDesa.map(ds => (
                            <option key={ds} value={ds}>{ds}</option>
                          ))}
                        </select>
                      ) : (
                        user.desa || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-earth-brown-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === user.id ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={editRole}
                          onChange={e => setEditRole(e.target.value)}
                          disabled={saving}
                        >
                          {roleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColor[user.role] || 'bg-gray-100 text-gray-700'}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-earth-brown-700">
                      {editId === user.id ? (
                        editDesa ? (
                          <select
                            className="border rounded px-2 py-1"
                            value={editWilayah}
                            onChange={e => setEditWilayah(e.target.value)}
                            disabled={saving}
                          >
                            <option value="">Pilih wilayah</option>
                            {getWilayahOptions(editDesa).map(w => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="border rounded px-2 py-1"
                            value={editWilayah}
                            onChange={e => setEditWilayah(e.target.value)}
                            disabled={saving}
                            placeholder="Masukkan wilayah"
                          />
                        )
                      ) : (
                        user.wilayah || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      {editId === user.id ? (
                        <>
                          <button
                            className="inline-flex items-center gap-1 text-green-600 hover:underline font-semibold"
                            onClick={() => handleSave(user)}
                            disabled={saving}
                          >
                            <Check className="w-4 h-4" /> Simpan
                          </button>
                          <button
                            className="inline-flex items-center gap-1 text-gray-600 hover:underline font-semibold"
                            onClick={handleCancel}
                            disabled={saving}
                          >
                            <X className="w-4 h-4" /> Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                            onClick={() => handleEdit(user)}
                            disabled={saving}
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            className="inline-flex items-center gap-1 text-red-600 hover:underline font-semibold"
                            onClick={() => handleDelete(user)}
                            disabled={saving}
                          >
                            <Trash2 className="w-4 h-4" /> Hapus
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 