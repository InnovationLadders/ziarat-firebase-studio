
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GiftRecommender } from '@/components/gift-recommender';
import { Card, CardContent } from '@/components/ui/card';
import { getProducts } from '@/lib/product-service';
import { getCategories } from '@/lib/category-service';
import { ProductCard } from '@/components/product-card';
import type { Category } from '@/lib/types';
import { CategorySidebar } from '@/components/category-sidebar';
import Link from 'next/link';

interface HomeProps {
  searchParams?: {
    category?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const selectedCategory = searchParams?.category;
  
  // Fetch products and categories. The service functions now handle errors and fallbacks.
  const [products, occasionCategories] = await Promise.all([
    getProducts(selectedCategory),
    getCategories()
  ]);

  const productCategories = ['الكل', ...new Set(occasionCategories.map(c => c.name))];

  return (
    <>
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
          <Image
            src="https://images.unsplash.com/photo-1693059740560-21151639561f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8SG9uZXljb21iJTIwQ2FrZXxlbnwwfHx8fDE3NTY4MDQxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="تغليف منتجات أنيق"
            fill
            className="object-cover -z-10"
            data-ai-hint="gift wrapping"
            priority
          />
          <div className="absolute inset-0 bg-black/50 -z-10" />
          <div className="container px-4 md:px-6 animate-fade-in-up" dir="rtl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline tracking-tight text-shadow-lg">
              عندك زيارة؟ احنا نبيض وجهك
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90 text-shadow">
              منتجات مختارة ومخصصة لكل زياراتك ، تصلك او تصل لمضيفك بأناقة وسرعة.
            </p>
            <Link href="/#featured">
              <Button size="lg" className="mt-8">
                تصفح كل المنتجات
              </Button>
            </Link>
          </div>
        </section>

        <section id="categories" className="py-12 md:py-24" dir="rtl">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">
              تسوق حسب المناسبة
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {occasionCategories.map((category) => (
                <Link href={`/?category=${encodeURIComponent(category.name)}#featured`} key={category.id} className="group block text-center">
                  <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <CardContent className="p-0">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-40 md:h-60"
                        data-ai-hint={category.dataAiHint || category.name.split(' ')[0]}
                      />
                    </CardContent>
                  </Card>
                  <h3 className="mt-4 text-lg font-semibold font-body tracking-wide">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="featured" className="py-12 md:py-24 bg-secondary/50 scroll-mt-16" dir="rtl">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">
              {selectedCategory && selectedCategory !== 'الكل' ? `منتجات: ${selectedCategory}` : 'منتجاتنا المميزة'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <aside className="md:col-span-1">
                <CategorySidebar categories={productCategories} selectedCategory={selectedCategory} />
              </aside>
              <div className="md:col-span-3">
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                   <div className="flex items-center justify-center col-span-full h-64">
                    <p className="text-muted-foreground text-lg text-center">
                      لا توجد منتجات لعرضها حاليًا في هذا التصنيف.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="ai-recommender" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <GiftRecommender />
            </div>
          </div>
        </section>
    </>
  );
}
