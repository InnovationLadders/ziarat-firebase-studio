import { getCategories } from "@/lib/category-service";
import { ProductForm } from "../_components/product-form";

export default async function NewProductPage() {
    const categories = await getCategories();
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">إضافة منتج جديد</h1>
            <ProductForm categories={categories.map(c => c.name)} />
        </div>
    )
}
