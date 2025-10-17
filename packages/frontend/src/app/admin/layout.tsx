import Link from "next/link";
import AdminAuthWrapper from "./AdminAuthWrapper";

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthWrapper>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold mb-8">Admin</h1>
          <nav className="flex flex-col space-y-2">
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <Link href="/admin/articles" className="hover:underline">Articles</Link>
            <Link href="/admin/categories" className="hover:underline">Categories</Link>
            <Link href="/admin/tags" className="hover:underline">Tags</Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AdminAuthWrapper>
  );
}
