'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (user.role === 'penyuluh') {
          router.push('/dashboard/penyuluh');
        } else if (user.role === 'gapoktan') {
          router.push('/dashboard/konsultan');
        } else {
          router.push('/dashboard/konsultan');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-green-50 to-earth-brown-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return null;
}