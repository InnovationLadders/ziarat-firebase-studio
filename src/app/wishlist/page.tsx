import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
      <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold mb-4">قائمة المفضلة فارغة</h1>
      <p className="text-muted-foreground mb-8">
        لم تقم بإضافة أي منتجات إلى قائمة مفضلتك بعد.
      </p>
      <Button asChild>
        <Link href="/">العودة للتسوق</Link>
      </Button>
    </div>
  );
}
