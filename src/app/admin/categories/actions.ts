
'use server';

import { addCategory, deleteCategory } from '@/lib/category-service';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, "اسم التصنيف يجب أن يكون حرفين على الأقل"),
  image: z.string().url("الرجاء إدخال رابط صورة صحيح"),
});

export async function addCategoryAction(prevState: any, formData: FormData) {
    const result = categorySchema.safeParse({
        name: formData.get('name'),
        image: formData.get('image'),
    });

    if (!result.success) {
        return { success: false, errors: result.error.flatten().fieldErrors };
    }

    try {
        await addCategory(result.data);
        revalidatePath('/admin/categories');
        revalidatePath('/');
        return { success: true, errors: null };
    } catch (e) {
        return { success: false, errors: { _form: ["حدث خطأ أثناء إضافة التصنيف."] } };
    }
}

export async function deleteCategoryAction(categoryId: string) {
    try {
        await deleteCategory(categoryId);
        revalidatePath('/admin/categories');
        revalidatePath('/');
    } catch (e) {
        console.error(e);
        // You might want to return an error to the client here
    }
}
