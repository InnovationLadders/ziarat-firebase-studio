'use server';

import { z } from 'zod';
import { useCart } from '@/hooks/use-cart';

const checkoutSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل.' }),
  phone: z.string().regex(/^05\d{8}$/, { message: 'الرجاء إدخال رقم جوال سعودي صحيح.' }),
  address: z.string().min(10, { message: 'العنوان يجب أن يكون 10 أحرف على الأقل.' }),
  city: z.string().min(2, { message: 'الرجاء إدخال اسم مدينة صحيح.' }),
  paymentMethod: z.enum(['mada', 'applepay', 'stcpay', 'cod']),
});

export async function placeOrderAction(prevState: any, formData: FormData) {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    console.error('Validation Error:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten() };
  }

  // In a real app, you would process the payment and save the order to the database.
  // For now, we'll just log the data.
  console.log('Order placed successfully!');
  console.log('Order Details:', parsed.data);
  // You would also get cart items here, but since this is a server action
  // accessing client-side state (zustand) is not direct.
  // A better approach would be to pass cart items as an argument or from a server-side cache.

  return { success: true, error: null };
}
