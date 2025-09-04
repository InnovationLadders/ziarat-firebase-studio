
'use server';

import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { User } from '@/context/auth-context';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صحيح.' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' }),
});

const registerSchema = z.object({
    name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل.' }),
    email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صحيح.' }),
    phone: z.string().regex(/^05\d{8}$/, { message: 'الرجاء إدخال رقم جوال سعودي صحيح يبدأ بـ 05.' }),
    password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' }),
});

function getFirebaseAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'البريد الإلكتروني غير صحيح.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
             return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        case 'auth/email-already-in-use':
            return 'هذا البريد الإلكتروني مستخدم بالفعل.';
        case 'auth/weak-password':
            return 'كلمة المرور ضعيفة جدًا. يجب أن تكون 6 أحرف على الأقل.';
        case 'auth/popup-closed-by-user':
            return 'تم إغلاق نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى.';
        case 'auth/cancelled-popup-request':
            return 'تم إلغاء الطلب. يرجى المحاولة مرة أخرى.';
        case 'auth/account-exists-with-different-credential':
            return 'يوجد حساب بالفعل بنفس البريد الإلكتروني ولكن بطريقة تسجيل دخول مختلفة.';
        case 'auth/operation-not-supported-in-this-environment':
             return 'هذه العملية غير مدعومة في هذه البيئة. يرجى التأكد من أنك في بيئة متصفح آمنة.';
        case 'permission-denied':
        case 'PERMISSION_DENIED':
             return 'حدث خطأ في الأذونات. يرجى مراجعة قواعد أمان Firestore.';
        default:
            return `حدث خطأ غير متوقع: ${errorCode}. يرجى المحاولة مرة أخرى.`;
    }
}


export async function loginAction(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const errorFields = parsed.error.flatten().fieldErrors;
    return { error: 'يرجى التحقق من البيانات المدخلة.', errors: errorFields };
  }

  let userCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, parsed.data.email, parsed.data.password);
  } catch (e: any) {
    return { error: getFirebaseAuthErrorMessage(e.code) };
  }

  const user = userCredential.user;
  const idToken = await user.getIdToken();

  cookies().set('firebaseIdToken', idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
  
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists() && userDoc.data()?.role === 'admin') {
      redirect('/admin/dashboard');
  }

  redirect('/');
}

export async function registerAction(prevState: any, formData: FormData) {
    const parsed = registerSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
        const errorFields = parsed.error.flatten().fieldErrors;
        return { error: 'يرجى التحقق من البيانات المدخلة.', errors: errorFields };
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, parsed.data.email, parsed.data.password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        await setDoc(doc(db, "users", user.uid), {
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            role: 'user',
        });
        
        console.log('Register Action - User created with data:', {
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            role: 'user',
        });
        
        cookies().set('firebaseIdToken', idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

    } catch (e: any) {
        return { error: getFirebaseAuthErrorMessage(e.code) };
    }
    
    redirect('/');
}


export async function logoutAction() {
    await signOut(auth);
    cookies().delete('firebaseIdToken');
    redirect('/');
}

export async function saveGoogleUserToFirestore(user: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null; phoneNumber?: string | null; }, idToken: string) {
    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        let userRole = 'user';

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                phone: user.phoneNumber || null, 
                role: 'user',
            });
        } else {
             const userData = userDoc.data() as User;
             userRole = userData.role || 'user';
        }
        
        cookies().set('firebaseIdToken', idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        if (userRole === 'admin') {
            redirect('/admin/dashboard');
        } else {
            redirect('/');
        }
    } catch(e: any) {
        console.error("Firestore save error:", e);
        // Fallback redirection even if firestore fails
        redirect('/');
        return { success: false, error: getFirebaseAuthErrorMessage(e.code) };
    }
     // This part will not be reached due to redirects, but it's good practice
    return { success: true };
}
