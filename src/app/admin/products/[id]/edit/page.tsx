import { getProduct } from "@/lib/product-service";
import { getCategories } from "@/lib/category-service";
import { notFound } from "next/navigation";
import { ProductForm } from "../../_components/product-form";

interface EditProductPageProps {
    params: {
        id: string;
    }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const [product, categories] = await Promise.all([
        getProduct(params.id),
        getCategories()
    ]);
    
    if (!product) {
        return notFound();
    }

    return (
        <div className="p-8">
             <h1 className="text-3xl font-bold mb-8">تعديل المنتج</h1>
             <ProductForm product={product} categories={categories.map(c => c.name)} />
        </div>
    )
}
