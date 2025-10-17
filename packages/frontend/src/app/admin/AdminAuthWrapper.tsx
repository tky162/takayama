'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    setIsAuthenticated(!!token);

    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [router, pathname]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  return <>{children}</>;
}
