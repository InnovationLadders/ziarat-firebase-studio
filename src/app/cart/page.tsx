
'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CartItem } from '@/hooks/use-cart';

// Helper to generate a unique ID for a cart item
const getCartItemId = (item: CartItem): string => {
    if (!item.selectedOptions || item.selectedOptions.length === 0) {
        return item.product.id;
    }
    // Ensure options are sorted for consistent ID generation
    const sortedOptions = [...item.selectedOptions].sort((a, b) => a.optionName.localeCompare(b.optionName));
    const optionString = sortedOptions.map((opt) => `${opt.optionName}:${opt.choiceName}`).join('|');
    return `${item.product.id}-${optionString}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalPrice = items.reduce(
    (acc, item) => acc + (item.finalPrice || item.product.price) * item.quantity,
    0
  );

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen">
          <ShoppingCart className="h-10 w-10 animate-pulse" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-4">سلة التسوق فارغة</h1>
        <p className="text-muted-foreground mb-8">
          لم تقم بإضافة أي منتجات إلى سلتك بعد.
        </p>
        <Button asChild>
          <Link href="/">العودة للتسوق</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const cartItemId = getCartItemId(item);
            return (
            <div
              key={cartItemId}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div>
                  <h2 className="font-semibold">{item.product.name}</h2>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                     <div className="text-sm text-muted-foreground">
                        {item.selectedOptions.map(opt => (
                            <span key={opt.optionName}>{opt.choiceName}</span>
                        )).reduce((prev, curr) => [prev, ', ', curr] as any)}
                     </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {(item.finalPrice || item.product.price).toFixed(2)} ر.س
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(cartItemId, parseInt(e.target.value))
                  }
                  className="w-20 text-center"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(cartItemId)}
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </div>
          )})}
        </div>
        <div className="lg:col-span-1">
          <div className="p-6 border rounded-lg bg-secondary/50">
            <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
            <div className="flex justify-between mb-2">
              <span>المجموع الفرعي</span>
              <span>{totalPrice.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>الشحن</span>
              <span className="text-primary">مجاني</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>الإجمالي</span>
              <span>{totalPrice.toFixed(2)} ر.س</span>
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">المتابعة للدفع</Link>
            </Button>
            <Button variant="outline" className="w-full mt-2" onClick={clearCart}>
                إفراغ السلة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
