'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTransition } from 'react';
import { deleteProductAction } from '../../actions';

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full text-right text-destructive">حذف</button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المنتج نهائيًا من قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await deleteProductAction(productId);
              });
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'جاري الحذف...' : 'نعم، قم بالحذف'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
