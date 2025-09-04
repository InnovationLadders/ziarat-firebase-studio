
'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { Heart, Menu, ShoppingCart, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { logoutAction } from '@/app/auth/actions';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

export function Header() {
  const { items } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const { user, loading } = useAuth();

  // Debug logging for user state
  useEffect(() => {
    console.log('Header - User state:', user);
    console.log('Header - Loading state:', loading);
  }, [user, loading]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/#categories', label: 'المناسبات' },
    { href: '/#featured', label: 'المنتجات' },
    { href: '/#ai-recommender', label: 'مساعد المنتجات' },
  ];

  const totalItems = isMounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir="rtl">
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                <span className="font-bold text-2xl font-headline">Ziarat</span>
                <span className="text-xl text-muted-foreground">
                  زيارات
                </span>
              </Link>
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="mr-4 hidden md:flex flex-1 items-center">
          <Link href="/" className="ml-6 flex items-center space-x-2">
            <span className="font-bold text-2xl font-headline">Ziarat</span>
            <span className="text-xl text-muted-foreground">
              زيارات
            </span>
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end space-x-1 ml-auto">
          <Link href="/wishlist" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
              <Heart className="h-5 w-5" />
              <span className="sr-only">المفضلة</span>
          </Link>
          
          <div className="relative">
            <Link href="/cart" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">عربة التسوق</span>
               {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          
          {loading ? (
             <Skeleton className="h-9 w-28" />
          ) : user ? (
              <div className="flex items-center gap-1">
                 <Link href="/profile" className={cn(buttonVariants({ variant: 'ghost' }), "px-2 flex items-center gap-2")}>
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user.displayName || 'ملفي الشخصي'}</span>
                </Link>
                <form action={logoutAction}>
                    <Button variant="ghost" size="icon" type="submit" aria-label="تسجيل الخروج">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </form>
              </div>
            ) : (
                 <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }), 'flex items-center gap-2')}>
                    <User className="h-5 w-5" />
                    <span>تسجيل الدخول</span>
                </Link>
            )
          }
        </div>
      </div>
    </header>
  );
}
