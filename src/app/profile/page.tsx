
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">معلوماتي الشخصية</h3>
            <Skeleton className="h-10 w-32" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">طلباتي</h3>
            <div className="border rounded-lg p-8 text-center space-y-4">
              <Skeleton className="h-12 w-12 mx-auto rounded-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-10 w-28 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect will run whenever loading or user state changes.
    // We only redirect if the loading is complete AND there is no user.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While authentication is in progress, show a skeleton UI.
  // This prevents the page from flashing or prematurely redirecting.
  if (loading || !user) {
    return <ProfileSkeleton />;
  }
  
  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
              <AvatarFallback>{getInitials(user.displayName || user.email)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.displayName || 'مستخدم جديد'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
                <h3 className="text-xl font-bold mb-4">معلوماتي الشخصية</h3>
                <Button variant="outline">تعديل الملف الشخصي</Button>
            </div>
             <div>
                <h3 className="text-xl font-bold mb-4">طلباتي</h3>
                <div className="border rounded-lg p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا يوجد لديك أي طلبات حاليًا.</p>
                    <Button className="mt-4" onClick={() => router.push('/')}>
                        ابدأ التسوق
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
