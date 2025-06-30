"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal");
      if (remember) {
        localStorage.setItem("app_user", JSON.stringify(data.user));
        localStorage.setItem("token", data.access_token);
      } else {
        sessionStorage.setItem("app_user", JSON.stringify(data.user));
        sessionStorage.setItem("token", data.access_token);
      }
      if (data.user.role === "konsultan_tani") {
        router.push("/dashboard/konsultan");
      } else if (data.user.role === "penyuluh") {
        router.push("/dashboard/penyuluh");
      } else if (data.user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/konsultan");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
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
          Masuk ke HarvestSun
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
          <form onSubmit={handleLogin} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Ingat saya
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-150">
                  Lupa password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700 transition-colors duration-150 w-full py-3 text-lg font-semibold rounded-xl shadow hover:shadow-lg"
                disabled={loading}
              >
                {loading ? "Loading..." : "Masuk"}
              </button>
            </div>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-4 text-gray-400">Atau masuk dengan</span>
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
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="font-medium text-green-600 hover:text-green-700 cursor-pointer ml-1 transition-colors duration-150"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 