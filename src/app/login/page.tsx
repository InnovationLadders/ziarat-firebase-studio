
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { loginAction, saveGoogleUserToFirestore } from '../auth/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';


function GoogleSignInButton() {
    const { toast } = useToast();

    const handleGoogleSignIn = async () => {
       const provider = new GoogleAuthProvider();
       try {
         const result = await signInWithPopup(auth, provider);
         const idToken = await result.user.getIdToken();
         const dbResult = await saveGoogleUserToFirestore(result.user, idToken);
         if (!dbResult.success) {
            toast({
              variant: 'destructive',
              title: 'خطأ في حفظ البيانات',
              description: dbResult.error,
            });
         }
       } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'خطأ في تسجيل الدخول',
            description: getFirebaseAuthErrorMessage(error.code),
         });
       }
    };

    return (
         <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            المتابعة باستخدام Google
        </Button>
    )
}

function getFirebaseAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/popup-closed-by-user':
            return 'تم إغلاق نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى.';
        case 'auth/cancelled-popup-request':
            return 'تم إلغاء الطلب. يرجى المحاولة مرة أخرى.';
        case 'auth/account-exists-with-different-credential':
            return 'يوجد حساب بالفعل بنفس البريد الإلكتروني ولكن بطريقة تسجيل دخول مختلفة.';
        default:
            return `حدث خطأ غير متوقع: ${errorCode}. يرجى المحاولة مرة أخرى.`;
    }
}


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7-3.13-7-7s3.13-7 7-7c2.18 0 3.54.88 4.38 1.62l2.82-2.82C18.46 2.38 15.7.92 12.48.92c-6.14 0-11 4.86-11 11s4.86 11 11 11c6.48 0 10.73-4.43 10.73-10.92 0-.73-.08-1.34-.2-1.92z" />
    </svg>
);


export default function LoginPage() {
    const [state, formAction, pending] = useActionState(loginAction, { error: null });
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if(state?.error) {
            toast({
                variant: 'destructive',
                title: 'خطأ في تسجيل الدخول',
                description: state.error,
            });
        }
    }, [state, toast])

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-secondary/20" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <GoogleSignInButton />
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    أو أكمل باستخدام
                    </span>
                </div>
            </div>
            <form className="space-y-4" action={formAction}>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" name="email" type="email" placeholder="user@example.com" required />
                 {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required />
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
                {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
              </div>
               <Button type="submit" className="w-full" disabled={pending}>
                 {pending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
               </Button>
            </form>
          </div>
           <div className="mt-4 text-center text-sm">
             ليس لديك حساب؟{' '}
             <Link href="/register" className="underline text-primary">
                أنشئ حسابًا جديدًا
             </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
