import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FaqPage() {
    const faqs = [
        {
            question: "ما هي مدة توصيل الطلبات؟",
            answer: "تستغرق مدة التوصيل عادة من 2 إلى 5 أيام عمل داخل المدن الرئيسية. قد تختلف المدة للمناطق الأخرى."
        },
        {
            question: "هل يمكنني تتبع طلبي؟",
            answer: "نعم، بمجرد شحن طلبك، ستستلم رسالة بريد إلكتروني تحتوي على رابط ورقم تتبع يمكنك استخدامه لمتابعة حالة الشحنة."
        },
        {
            question: "ما هي سياسة الإرجاع والاستبدال؟",
            answer: "يمكن إرجاع المنتجات خلال 7 أيام من تاريخ الاستلام بشرط أن تكون في حالتها الأصلية وغير مستخدمة. للمزيد من التفاصيل، يرجى مراجعة صفحة الشحن والإرجاع."
        },
        {
            question: "هل تقدمون خدمة تغليف الهدايا؟",
            answer: "نعم، جميع منتجاتنا تأتي بتغليف هدايا أنيق وجذاب. كما يمكنك إضافة بطاقة إهداء مخصصة عند إتمام الطلب."
        }
    ]

    return (
        <div className="container mx-auto px-4 py-12" dir="rtl">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                     <div className="flex items-center gap-4">
                        <HelpCircle className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-headline">الأسئلة الشائعة</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
