'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [router, pathname]);

  if (!localStorage.getItem('admin-token') && pathname !== '/admin/login') {
      return <div>Loading...</div>; // Or a proper loading spinner
  }

  return <>{children}</>;
}
