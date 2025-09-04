
'use client';

import { ReactNode, useEffect } from 'react';
import { Gift, Package, Users, Settings, Tag } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function AdminLayoutSkeleton() {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <aside className="w-64 border-l bg-secondary/20 p-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
      <main className="flex-1 bg-background">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-24" />
        </header>
        <div className="p-8">
            <Skeleton className="h-96 w-full" />
        </div>
      </main>
    </div>
  );
}


interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Only perform checks once loading is complete
    if (!loading) {
      if (!user) {
        // If no user, redirect to login
        router.replace('/login');
      } else if (user.role !== 'admin') {
        // If user is not an admin, redirect to home
        router.replace('/');
      }
    }
  }, [user, loading, router]);


  // While loading, or if the user is not a verified admin yet, show skeleton.
  // This prevents flashing the admin content to non-admin users or during auth checks.
  if (loading || !user || user.role !== 'admin') {
    return <AdminLayoutSkeleton />;
  }

  const navItems = [
    { href: '/admin/dashboard', icon: Package, label: 'المنتجات' },
    { href: '/admin/categories', icon: Tag, label: 'التصنيفات' },
    { href: '#', icon: Users, label: 'العملاء' },
    { href: '#', icon: Gift, label: 'الطلبات' },
    { href: '#', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <div className="flex min-h-screen" dir="rtl">
      <aside className="w-64 border-l bg-secondary/20 p-6">
        <div className="mb-8 flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl font-headline">Ziarat</span>
              <span className="text-xl text-muted-foreground">
                زيارات
              </span>
            </Link>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-background">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <h1 className="text-xl font-semibold">لوحة التحكم</h1>
             <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                العودة للمتجر
             </Link>
        </header>
        {children}
      </main>
    </div>
  );
}
