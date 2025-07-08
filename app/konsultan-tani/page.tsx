"use client";

import { useEffect, useState } from "react";
import { getGapoktanList, Gapoktan } from "@/services/tugasService";
import { useAuth } from "@/hooks/useAuth";
import { Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function GapoktanPage() {
  const { user } = useAuth();
  const [gapoktanList, setGapoktanList] = useState<Gapoktan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGapoktan = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGapoktanList();
        setGapoktanList(data);
      } catch (e: any) {
        setError(e.message || "Gagal mengambil data gapoktan");
      } finally {
        setLoading(false);
      }
    };
    fetchGapoktan();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-earth-green-600" />
          <h1 className="text-2xl font-bold text-earth-brown-800">Daftar Gapoktan Satu Wilayah</h1>
        </div>
        <div className="bg-white rounded-xl shadow border overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-earth-brown-400">Memuat...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : gapoktanList.length === 0 ? (
            <div className="p-8 text-center text-earth-brown-400">Belum ada gapoktan di wilayah ini</div>
          ) : (
            <table className="min-w-full divide-y divide-earth-brown-200">
              <thead className="bg-earth-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-earth-brown-600 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-earth-brown-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-earth-brown-600 uppercase tracking-wider">Wilayah</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-earth-brown-100">
                {gapoktanList.map((g, idx) => (
                  <tr key={g.id} className={idx % 2 === 0 ? "bg-earth-green-50/40" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-earth-brown-800">{g.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-earth-brown-700">{g.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-earth-green-700">{g.wilayah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 