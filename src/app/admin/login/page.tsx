import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">لوحة التحكم</CardTitle>
          <CardDescription>
            الرجاء تسجيل الدخول للمتابعة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="admin@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
             <Link href="/" className="underline">
                العودة إلى المتجر
             </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
