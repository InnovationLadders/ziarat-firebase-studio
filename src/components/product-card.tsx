
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, StarHalf, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { addItem } = useCart();
  const router = useRouter();

  const hasOptions = product.options && product.options.length > 0;
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // For products with options, user should select them on the product page
    if (hasOptions) {
        e.preventDefault(); // prevent link navigation
        router.push(`/products/${product.id}`);
        return;
    }
    addItem(product);
    toast({
      title: "تمت الإضافة للسلة",
      description: `تمت إضافة "${product.name}" إلى سلة التسوق بنجاح.`,
    });
  }

  const renderStars = () => {
    const stars = [];
    const rating = product.rating || 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-primary text-primary" />);
    }
    if (halfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-primary text-primary" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted" />);
    }
    return stars;
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
       <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0 border-b">
            <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-56"
            data-ai-hint={product.dataAiHint}
            />
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow text-right">
        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
        <CardTitle className="text-lg font-body font-bold tracking-wide">
          <Link href={`/products/${product.id}`} className="hover:text-primary">{product.name}</Link>
        </CardTitle>
        <div className="flex items-center justify-end mt-2">
           <span className="mr-2 text-xs text-muted-foreground">{product.reviews} مراجعات</span>
          <div className="flex items-center">
            {renderStars()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
         <Button onClick={handleAddToCart}>
           <ShoppingCart className="ml-2 h-4 w-4" />
           {hasOptions ? 'اختر الخيارات' : 'أضف للسلة'}
        </Button>
        <p className="text-xl font-bold font-body text-primary">
          {hasOptions ? `يبدأ من ` : ''}{product.price.toFixed(2)} ر.س
        </p>
      </CardFooter>
    </Card>
  );
}
