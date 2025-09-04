'use server';

/**
 * @fileOverview Recommends products based on the occasion and recipient details.
 *
 * - recommendProducts - A function that recommends products.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendProductsInputSchema = z.object({
  occasion: z
    .string()
    .describe('The occasion for the product (e.g., new baby, get well soon, birthday).'),
  recipientDetails: z
    .string()
    .describe(
      'Details about the recipient, such as their age, gender, interests, and relationship to the giver.'
    ),
});
export type RecommendProductsInput = z.infer<typeof RecommendProductsInputSchema>;

const RecommendProductsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of product recommendations appropriate for the occasion and recipient.'),
});
export type RecommendProductsOutput = z.infer<typeof RecommendProductsOutputSchema>;

export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
  return recommendProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: {schema: RecommendProductsInputSchema},
  output: {schema: RecommendProductsOutputSchema},
  prompt: `You are a product recommendation expert. Based on the occasion and recipient details provided, you will generate a list of suitable product recommendations.

Occasion: {{{occasion}}}
Recipient Details: {{{recipientDetails}}}

Please provide a list of product recommendations that are appropriate for the given occasion and recipient.`,
});

const recommendProductsFlow = ai.defineFlow(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
