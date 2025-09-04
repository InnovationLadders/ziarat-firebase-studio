import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageCheck, Undo2 } from "lucide-react";

export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 py-12" dir="rtl">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4">
                         <PackageCheck className="h-10 w-10 text-primary" />
                         <CardTitle className="text-3xl font-headline">الشحن والإرجاع</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">سياسة الشحن</h3>
                        <div className="space-y-2 text-lg text-muted-foreground">
                            <p>نحن نقدم خدمة الشحن إلى جميع مدن المملكة العربية السعودية.</p>
                            <p>مدة التوصيل: 2-5 أيام عمل للمدن الرئيسية، وقد تصل إلى 10 أيام للمناطق الأخرى.</p>
                            <p>تكلفة الشحن: شحن مجاني لجميع الطلبات فوق 300 ريال سعودي. للطلبات أقل من ذلك، تبلغ تكلفة الشحن 30 ريالًا.</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><Undo2 /> سياسة الإرجاع</h3>
                        <div className="space-y-2 text-lg text-muted-foreground">
                           <p>نسعى لرضاكم التام. إذا لم تكن راضيًا عن طلبك، يمكنك إرجاعه خلال 7 أيام من تاريخ الاستلام.</p>
                           <p>شروط الإرجاع: يجب أن يكون المنتج في حالته الأصلية، غير مستخدم، وفي تغليفه الأصلي.</p>
                           <p>رسوم الإرجاع: يتحمل العميل تكلفة شحن الإرجاع ما لم يكن المنتج به عيب مصنعي.</p>
                           <p>للبدء في عملية الإرجاع، يرجى التواصل مع خدمة العملاء عبر صفحة "تواصل معنا".</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
