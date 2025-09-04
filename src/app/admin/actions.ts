
'use server';

import { addProduct, deleteProduct, updateProduct } from "@/lib/product-service";
import { Product, ProductOption } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productOptionChoiceSchema = z.object({
    name: z.string().min(1, "اسم الخيار مطلوب"),
    priceModifier: z.coerce.number(),
});

const productOptionSchema = z.object({
    name: z.string().min(1, "اسم مجموعة الخيارات مطلوب"),
    choices: z.array(productOptionChoiceSchema).min(1, "يجب إضافة خيار واحد على الأقل"),
});

const productSchema = z.object({
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    price: z.coerce.number().min(1, "السعر يجب أن يكون أكبر من صفر"),
    category: z.string().min(1, "الرجاء اختيار تصنيف"),
    image: z.string().url("الرجاء إدخال رابط صورة صحيح"),
    options: z.array(productOptionSchema).optional(),
});


// Helper to transform form data into a structured object
function processFormData(formData: FormData) {
    const data: any = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        image: formData.get('image'),
        options: []
    };

    const options: ProductOption[] = [];
    const optionIndices = [...new Set([...formData.keys()].map(k => k.match(/^options\[(\d+)\]\.name$/)).filter(Boolean).map(m => m![1]))];

    optionIndices.forEach(optionIndex => {
        const optionName = formData.get(`options[${optionIndex}].name`);
        if (!optionName) return;

        const option: ProductOption = {
            name: optionName.toString(),
            choices: []
        };

        const choiceIndices = [...new Set([...formData.keys()].map(k => k.match(`^options\\[${optionIndex}\\]\\.choices\\[(\\d+)\\]\\.name$`)).filter(Boolean).map(m => m![1]))];

        choiceIndices.forEach(choiceIndex => {
            const choiceName = formData.get(`options[${optionIndex}].choices[${choiceIndex}].name`);
            const priceModifier = formData.get(`options[${optionIndex}].choices[${choiceIndex}].priceModifier`);

            if (choiceName) {
                option.choices.push({
                    name: choiceName.toString(),
                    priceModifier: parseFloat(priceModifier?.toString() || '0')
                });
            }
        });

        if(option.choices.length > 0) {
            options.push(option);
        }
    });

    data.options = options;
    return data;
}


export async function addProductAction(prevState: any, formData: FormData) {
    const rawData = processFormData(formData);
    const result = productSchema.safeParse(rawData);

    if (result.success === false) {
        return result.error.formErrors;
    }
    
    const data = result.data;
    await addProduct({
        ...data,
        options: data.options || [],
        tags: data.category.split(' '),
        rating: 0,
        reviews: 0
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    redirect('/admin/dashboard');
}

export async function updateProductAction(productId: string, prevState: any, formData: FormData) {
    const rawData = processFormData(formData);
    const result = productSchema.safeParse(rawData);

    if (result.success === false) {
        return result.error.formErrors;
    }
    
    const data = result.data;
    await updateProduct(productId, { ...data, options: data.options || [] });

    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    revalidatePath(`/products/${productId}`);
    revalidatePath(`/admin/products/${productId}/edit`);
    redirect('/admin/dashboard');
}


export async function deleteProductAction(productId: string) {
    await deleteProduct(productId);
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
}
