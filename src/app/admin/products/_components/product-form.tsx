
'use client';

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useFieldArray, useForm } from 'react-hook-form';
import { addProductAction, updateProductAction } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/types";
import { Trash2, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
    product?: Product | null;
    categories: string[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
    const action = product ? updateProductAction.bind(null, product.id) : addProductAction;
    const [error, formAction] = useActionState(action, {});
    const { pending } = useFormStatus();

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>تفاصيل المنتج الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">اسم المنتج</Label>
                        <Input 
                            type="text" 
                            id="name" 
                            name="name" 
                            defaultValue={product?.name}
                            required 
                        />
                         {error?.fieldErrors?.name && <p className="text-destructive text-sm">{error.fieldErrors.name[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">وصف المنتج</Label>
                        <Textarea 
                            id="description" 
                            name="description" 
                            defaultValue={product?.description}
                            required 
                        />
                         {error?.fieldErrors?.description && <p className="text-destructive text-sm">{error.fieldErrors.description[0]}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">السعر الأساسي (بالريال)</Label>
                            <Input 
                                type="number" 
                                id="price" 
                                name="price" 
                                defaultValue={product?.price}
                                required 
                                step="0.01"
                            />
                             {error?.fieldErrors?.price && <p className="text-destructive text-sm">{error.fieldErrors.price[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">التصنيف</Label>
                            <Select name="category" defaultValue={product?.category} required>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="اختر تصنيفًا" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {error?.fieldErrors?.category && <p className="text-destructive text-sm">{error.fieldErrors.category[0]}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">رابط صورة المنتج</Label>
                        <Input 
                            type="url" 
                            id="image" 
                            name="image" 
                            defaultValue={product?.image}
                            required 
                        />
                         {error?.fieldErrors?.image && <p className="text-destructive text-sm">{error.fieldErrors.image[0]}</p>}
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-8" />
            
            <OptionsSection defaultOptions={product?.options} />

            <CardFooter className="justify-end mt-8 p-0">
                <Button type="submit" disabled={pending} size="lg">
                    {pending ? (product ? 'جاري التحديث...' : 'جاري الإضافة...') : (product ? 'حفظ التعديلات' : 'إضافة المنتج')}
                </Button>
            </CardFooter>
        </form>
    )
}

function OptionsSection({ defaultOptions }: { defaultOptions?: Product['options'] }) {
     const { control, register } = useForm({
        defaultValues: {
            options: defaultOptions || [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>خيارات التخصيص</CardTitle>
                <CardDescription>
                    أضف مجموعات خيارات للمنتج مثل الحجم، اللون، أو الإضافات. يمكن لكل خيار تعديل السعر الأساسي.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {fields.map((field, optionIndex) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">مجموعة الخيارات رقم {optionIndex + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(optionIndex)}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor={`options[${optionIndex}].name`}>اسم المجموعة (مثال: الحجم)</Label>
                             <Input 
                                {...register(`options.${optionIndex}.name` as const, { value: field.name })}
                                id={`options[${optionIndex}].name`}
                                name={`options[${optionIndex}].name`}
                                placeholder="الحجم، اللون، إضافة..."
                                defaultValue={field.name}
                             />
                        </div>
                        <ChoicesSection optionIndex={optionIndex} control={control} register={register} defaultChoices={field.choices}/>
                    </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => append({ name: '', choices: [{ name: '', priceModifier: 0 }] })}>
                     <PlusCircle className="mr-2" />
                     إضافة مجموعة خيارات
                </Button>
            </CardContent>
        </Card>
    );
}

function ChoicesSection({ optionIndex, control, register, defaultChoices }: { optionIndex: number, control: any, register: any, defaultChoices: any[] }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `options.${optionIndex}.choices`,
        
    });
    
    // This is a workaround to ensure the form is populated with default values
    React.useEffect(() => {
        if(fields.length === 0 && defaultChoices.length > 0) {
            defaultChoices.forEach(choice => append(choice, { shouldFocus: false }))
        }
    }, [fields, append, defaultChoices])

    return (
        <div className="space-y-4 pl-4 border-r-2">
             <Label>الخيارات المتاحة</Label>
            {fields.map((field, choiceIndex) => (
                <div key={field.id} className="flex items-end gap-4">
                    <div className="flex-grow space-y-2">
                        <Label htmlFor={`options[${optionIndex}].choices[${choiceIndex}].name`} className="text-xs">اسم الخيار</Label>
                        <Input 
                            {...register(`options.${optionIndex}.choices.${choiceIndex}.name` as const)}
                            id={`options[${optionIndex}].choices[${choiceIndex}].name`}
                            name={`options[${optionIndex}].choices[${choiceIndex}].name`}
                            placeholder="صغير، أحمر..."
                             defaultValue={(field as any).name}
                        />
                    </div>
                     <div className="flex-grow space-y-2">
                        <Label htmlFor={`options[${optionIndex}].choices[${choiceIndex}].priceModifier`} className="text-xs">تعديل السعر (ر.س)</Label>
                        <Input 
                            type="number"
                            step="0.01"
                            {...register(`options.${optionIndex}.choices.${choiceIndex}.priceModifier` as const)}
                             id={`options[${optionIndex}].choices[${choiceIndex}].priceModifier`}
                            name={`options[${optionIndex}].choices[${choiceIndex}].priceModifier`}
                            placeholder="0 أو 50 أو -10"
                            defaultValue={(field as any).priceModifier}
                        />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(choiceIndex)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', priceModifier: 0 })}>
                <PlusCircle className="mr-2" />
                إضافة خيار
            </Button>
        </div>
    );
}
