import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12" dir="rtl">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Mail className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-headline">تواصل معنا</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        نسعد بتواصلكم معنا! سواء كان لديكم سؤال، اقتراح، أو تحتاجون مساعدة في اختيار هدية، فريقنا جاهز لخدمتكم.
                    </p>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">الاسم</Label>
                            <Input id="name" placeholder="اسمكم الكريم" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input id="email" type="email" placeholder="example@email.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">الرسالة</Label>
                            <Textarea id="message" placeholder="اكتب رسالتك هنا..." />
                        </div>
                        <Button type="submit" className="w-full">إرسال</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
