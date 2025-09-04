import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12" dir="rtl">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Users className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-headline">من نحن</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-lg text-muted-foreground">
                    <p>
                        مرحبًا بكم في "هدايا زيارات"، وجهتكم الأولى لاختيار وتقديم الهدايا التي تليق بمناسباتكم وتعبّر عن مشاعركم بأناقة ورقي. 
                        نحن نؤمن بأن الهدية ليست مجرد منتج، بل هي رسالة محبة وتقدير تصل إلى قلوب أحبائكم.
                    </p>
                    <p>
                        تأسس متجرنا على فكرة بسيطة: تسهيل مهمة اختيار الهدية المثالية لكل مناسبة، سواء كانت زيارة عائلية، تهنئة بمولود جديد، تمنيات بالشفاء، أو أي لحظة تستحق الاحتفاء بها.
                        نحن نحرص على اختيار منتجاتنا بعناية فائقة، مع التركيز على الجودة العالية والتصميم الفريد والتغليف الجذاب.
                    </p>
                     <p>
                        فريقنا يعمل بشغف ليضمن لكم تجربة تسوق ممتعة وسلسة، من لحظة تصفحكم للمتجر وحتى وصول الهدية إلى وجهتها.
                        في "هدايا زيارات"، نحن لا نبيع الهدايا فقط، بل نساعدكم على صنع ذكريات لا تُنسى.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
