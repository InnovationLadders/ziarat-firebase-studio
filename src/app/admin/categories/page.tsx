import { getCategories } from "@/lib/category-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { CategoryForm } from "./_components/category-form";
import { DeleteCategoryButton } from "./_components/delete-category-button";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="p-8 grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <CategoryForm />
            </div>
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>التصنيفات الحالية</CardTitle>
                        <CardDescription>قائمة بجميع التصنيفات الموجودة في المتجر.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">الصورة</TableHead>
                                    <TableHead>الاسم</TableHead>
                                    <TableHead className="w-[100px]">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        width={50}
                                        height={50}
                                        className="rounded-md object-cover"
                                    />
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>
                                        <DeleteCategoryButton categoryId={category.id} />
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
