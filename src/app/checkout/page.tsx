'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Truck, Smartphone, Wallet, Apple } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { placeOrderAction } from './actions';
import { useActionState } from 'react';

const initialState = {
  success: false,
  error: null as any,
};

function SubmitButton() {
    // This hook is not available in server components, so we keep this as a child
    // const { pending } = useFormStatus();
    const pending = false;
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? 'جاري إتمام الطلب...' : 'إتمام الطلب'}
    </Button>
  );
}


export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [state, formAction] = useActionState(placeOrderAction, initialState);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(state.success) {
        toast({
            title: "تم استلام طلبك بنجاح!",
            description: "سنتواصل معك قريبًا لتأكيد تفاصيل الطلب.",
        });
        clearCart();
        router.push('/');
    } else if (state.error) {
        // This can be improved to show field-specific errors
        toast({
            variant: "destructive",
            title: "حدث خطأ!",
            description: "يرجى مراجعة بياناتك والمحاولة مرة أخرى."
        });
    }
  }, [state, toast, clearCart, router])

  if (!isMounted) {
    return null; // or a loading spinner
  }

  if (items.length === 0) {
    // Redirect to home if cart is empty after mount
    router.push('/');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-center">إتمام الطلب</h1>
      <form action={formAction}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Shipping Details */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">تفاصيل الشحن</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input id="name" name="name" placeholder="اسم مستلم الهدية" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الجوال</Label>
                    <Input id="phone" name="phone" placeholder="05xxxxxxxx" required />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                    <Label htmlFor="address">العنوان</Label>
                    <Input id="address" name="address" placeholder="اسم الشارع، الحي" required />
                </div>
                 <div className="space-y-2 mt-4">
                    <Label htmlFor="city">المدينة</Label>
                    <Input id="city" name="city" placeholder="الرياض" required />
                </div>
              </div>

              {/* Payment Method */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">طريقة الدفع</h2>
                <RadioGroup name="paymentMethod" defaultValue="mada" className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <Label htmlFor="mada" className="text-base">مدى</Label>
                    </div>
                    <RadioGroupItem value="mada" id="mada" />
                  </div>
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Apple className="h-6 w-6" />
                      <Label htmlFor="applepay" className="text-base">Apple Pay</Label>
                    </div>
                    <RadioGroupItem value="applepay" id="applepay" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Smartphone className="h-6 w-6 text-green-600" />
                       <Label htmlFor="stcpay" className="text-base">STC Pay</Label>
                    </div>
                    <RadioGroupItem value="stcpay" id="stcpay" />
                  </div>
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Truck className="h-6 w-6 text-orange-500" />
                      <Label htmlFor="cod" className="text-base">الدفع عند الاستلام</Label>
                    </div>
                    <RadioGroupItem value="cod" id="cod" />
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 border rounded-lg bg-secondary/50 sticky top-24">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image src={product.image} alt={product.name} width={48} height={48} className="rounded-md" />
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">الكمية: {quantity}</p>
                        </div>
                    </div>
                    <p className="font-medium">{(product.price * quantity).toFixed(2)} ر.س</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                 <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span>{totalPrice.toFixed(2)} ر.س</span>
                </div>
                 <div className="flex justify-between">
                    <span>الشحن</span>
                    <span className="text-primary">مجاني</span>
                </div>
                <Separator className="my-2"/>
                 <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي</span>
                    <span>{totalPrice.toFixed(2)} ر.س</span>
                </div>
              </div>
              <Separator className="my-4" />
              <SubmitButton />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
