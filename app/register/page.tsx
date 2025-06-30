"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("konsultan_tani");
  const [wilayah, setWilayah] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirmation) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }
    
    // Validasi wilayah untuk konsultan
    if (role === "konsultan_tani" && !wilayah.trim()) {
      setError("Wilayah harus diisi untuk konsultan tani");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role, 
          wilayah: role === "konsultan_tani" ? wilayah : undefined 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registrasi gagal");
      if (data.user && data.user.role) {
        if (data.user.role === "konsultan_tani") {
          router.push("/dashboard/konsultan");
        } else if (data.user.role === "penyuluh") {
          router.push("/dashboard/penyuluh");
        } else if (data.user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">HS</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Daftar di HarvestSun
        </h2>
        <p className="text-center text-base text-gray-500 mb-6">
          Platform pertanian digital untuk Indonesia
        </p>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full"
                placeholder="Nama lengkap"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full"
                placeholder="Alamat email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full"
                placeholder="Ulangi password"
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Daftar Sebagai
              </label>
              <select
                id="role"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="konsultan_tani">Konsultan Tani</option>
                <option value="penyuluh">Penyuluh</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {/* Wilayah field - hanya untuk konsultan */}
            {role === "konsultan_tani" && (
              <div>
                <label htmlFor="wilayah" className="block text-sm font-medium text-gray-700 mb-1">
                  Wilayah/Desa <span className="text-red-500">*</span>
                </label>
                <input
                  id="wilayah"
                  type="text"
                  required
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition w-full"
                  placeholder="Contoh: Desa Sukamaju, Kecamatan Cibinong"
                  value={wilayah}
                  onChange={e => setWilayah(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan nama desa atau wilayah tempat Anda bekerja
                </p>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700 transition-colors duration-150 w-full py-3 text-lg font-semibold rounded-xl shadow hover:shadow-lg"
                disabled={loading}
              >
                {loading ? "Loading..." : "Daftar"}
              </button>
            </div>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-4 text-gray-400">Atau daftar dengan</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-3 mb-6">
          <button
              type="button"
              className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-150 w-full flex items-center justify-center py-2 rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </button>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="font-medium text-green-600 hover:text-green-700 cursor-pointer ml-1 transition-colors duration-150"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 