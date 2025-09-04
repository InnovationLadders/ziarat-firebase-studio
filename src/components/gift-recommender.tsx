'use client';

import { useFormStatus } from 'react-dom';
import { getRecommendationsAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  recommendations: [] as string[],
  error: null as any,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          جاري البحث...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          ابحث عن المنتج المثالي
        </>
      )}
    </Button>
  );
}

export function GiftRecommender() {
  const [state, formAction] = useActionState(getRecommendationsAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error?.formErrors?.length) {
      toast({
        variant: 'destructive',
        title: 'حدث خطأ ما!',
        description: state.error.formErrors[0],
      });
    }
  }, [state.error, toast]);

  return (
    <Card className="border-primary/20 border-2 shadow-xl" dir="rtl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">محتار في اختيار منتج؟ دعنا نساعدك!</CardTitle>
        <CardDescription className="text-lg">
          مساعد المنتجات الذكي سيقترح عليك المنتج المثالي.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="occasion" className="font-semibold">ما هي المناسبة؟</Label>
            <Input id="occasion" name="occasion" placeholder="مثال: مولود جديد، زيارة مريض، عيد ميلاد" required />
            {state.error?.fieldErrors?.occasion && (
              <p className="text-sm text-destructive mt-1">{state.error.fieldErrors.occasion[0]}</p>
            )}
          </div>
          <div>
            <Label htmlFor="recipientDetails" className="font-semibold">أخبرنا عن الشخص الذي ستقدم له المنتج</Label>
            <Textarea id="recipientDetails" name="recipientDetails" placeholder="مثال: صديقة في الثلاثينات تحب القهوة والقراءة." required />
             {state.error?.fieldErrors?.recipientDetails && (
              <p className="text-sm text-destructive mt-1">{state.error.fieldErrors.recipientDetails[0]}</p>
            )}
          </div>
          <SubmitButton />
        </form>

        {state.recommendations && state.recommendations.length > 0 && (
          <div className="mt-8">
             <Alert>
                <Gift className="h-4 w-4 ml-2" />
                <AlertTitle className="font-headline text-xl">إليك بعض الأفكار!</AlertTitle>
                <AlertDescription>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                        {state.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
