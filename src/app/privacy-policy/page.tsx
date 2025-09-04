import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12" dir="rtl">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-headline">سياسة الخصوصية</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-lg text-muted-foreground">
                    <p>
                        نحن في "هدايا زيارات" نلتزم بحماية خصوصية معلوماتك الشخصية. توضح هذه السياسة كيف نجمع ونستخدم ونحمي البيانات التي تقدمها لنا.
                    </p>
                    <h4 className="text-xl font-bold text-foreground pt-4">المعلومات التي نجمعها:</h4>
                    <p>
                        نقوم بجمع المعلومات التي تقدمها مباشرة، مثل الاسم، العنوان، البريد الإلكتروني، ورقم الهاتف عند إتمام الطلب أو التسجيل في موقعنا.
                    </p>
                     <h4 className="text-xl font-bold text-foreground pt-4">كيف نستخدم معلوماتك:</h4>
                    <p>
                        تُستخدم معلوماتك لمعالجة طلباتك، تحسين تجربة التسوق الخاصة بك، والتواصل معك بشأن العروض الجديدة أو تحديثات الطلب.
                    </p>
                    <h4 className="text-xl font-bold text-foreground pt-4">حماية البيانات:</h4>
                     <p>
                       نحن نتخذ إجراءات أمنية صارمة لحماية بياناتك من الوصول غير المصرح به. لا نشارك معلوماتك الشخصية مع أي طرف ثالث لأغراض تسويقية.
                    </p>
                     <p>
                        باستخدامك لموقعنا، فإنك توافق على سياسة الخصوصية هذه. قد يتم تحديث هذه السياسة من وقت لآخر، لذا نوصي بمراجعتها بشكل دوري.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
