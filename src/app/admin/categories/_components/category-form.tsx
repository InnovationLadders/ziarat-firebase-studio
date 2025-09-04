
'use client';

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { addCategoryAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "جاري الإضافة..." : <><PlusCircle className="mr-2" /> إضافة تصنيف</>}
        </Button>
    )
}

const initialState = {
    success: false,
    errors: null as any
};

export function CategoryForm() {
    const [state, formAction] = useActionState(addCategoryAction, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            toast({ title: "نجاح", description: "تم إضافة التصنيف بنجاح." });
            formRef.current?.reset();
        } else if (state.errors) {
            // Can be enhanced to show specific field errors
            const errorMessage = state.errors?._form?.[0] || "يرجى التحقق من البيانات المدخلة.";
            toast({ variant: "destructive", title: "خطأ", description: errorMessage });
        }
    }, [state, toast]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>إضافة تصنيف جديد</CardTitle>
                <CardDescription>أضف تصنيفًا جديدًا لعرضه في المتجر.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">اسم التصنيف</Label>
                        <Input id="name" name="name" placeholder="مثال: هدايا العيد" required />
                        {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="image">رابط صورة التصنيف</Label>
                        <Input id="image" name="image" type="url" placeholder="https://picsum.photos/300/300" required />
                         {state?.errors?.image && <p className="text-sm text-destructive mt-1">{state.errors.image[0]}</p>}
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
