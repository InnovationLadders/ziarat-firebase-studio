
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
import { deleteCategoryAction } from '../../categories/actions';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
             <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف التصنيف نهائيًا.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await deleteCategoryAction(categoryId);
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
