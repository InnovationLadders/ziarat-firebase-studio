import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary/50" dir="rtl">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl font-headline">Ziarat</span>
              <span className="text-xl text-muted-foreground">
                زيارات
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              هدايا مختارة لكل مناسبة، تصلك بأناقة.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">الرئيسية</Link></li>
              <li><Link href="/#featured" className="hover:text-primary">كل المنتجات</Link></li>
              <li><Link href="/about" className="hover:text-primary">من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-primary">تواصل معنا</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">الدعم</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary">الأسئلة الشائعة</Link></li>
              <li><Link href="/shipping" className="hover:text-primary">الشحن والإرجاع</Link></li>
              <li><Link href="/track-order" className="hover:text-primary">تتبع الطلب</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">النشرة البريدية</h4>
            <p className="text-sm text-muted-foreground">اشترك ليصلك جديدنا والعروض الخاصة.</p>
            <div className="flex">
              <Input type="email" placeholder="بريدك الإلكتروني" className="rounded-r-none rounded-l-md" />
              <Button type="submit" className="rounded-l-none rounded-r-md">اشتراك</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} هدايا زيارات. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
