'use server';

import { recommendProducts } from '@/ai/flows/product-recommendations';
import { z } from 'zod';

const schema = z.object({
  occasion: z.string().min(3, { message: 'Occasion must be at least 3 characters long.' }),
  recipientDetails: z.string().min(10, { message: 'Please provide more details about the recipient (at least 10 characters).' }),
});

export async function getRecommendationsAction(prevState: any, formData: FormData) {
  const parsed = schema.safeParse({
    occasion: formData.get('occasion'),
    recipientDetails: formData.get('recipientDetails'),
  });

  if (!parsed.success) {
    return { recommendations: [], error: parsed.error.flatten() };
  }

  try {
    const result = await recommendProducts({
      occasion: parsed.data.occasion,
      recipientDetails: parsed.data.recipientDetails,
    });
    return { recommendations: result.recommendations, error: null };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { recommendations: [], error: { formErrors: [errorMessage], fieldErrors: {} } };
  }
}
