import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export default function TrackOrderPage() {
    return (
        <div className="container mx-auto px-4 py-12" dir="rtl">
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                     <div className="flex items-center gap-4">
                        <MapPin className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-headline">تتبع طلبك</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                       أدخل رقم الطلب الذي تلقيته في رسالة التأكيد لمتابعة حالة شحنتك.
                    </p>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="orderNumber">رقم الطلب</Label>
                            <Input id="orderNumber" placeholder="مثال: ZRT-12345" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني المستخدم في الطلب</Label>
                            <Input id="email" type="email" placeholder="example@email.com" />
                        </div>
                        <Button type="submit" className="w-full">تتبع</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
