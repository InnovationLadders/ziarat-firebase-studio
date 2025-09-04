
'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProduct } from '@/lib/product-service';
import type { Product, SelectedOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, Star, StarHalf } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setLoading(true);
        const fetchedProduct = await getProduct(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setCurrentPrice(fetchedProduct.price);
          // Set default options
          if (fetchedProduct.options) {
            const defaultOptions = fetchedProduct.options.map(opt => ({
                optionName: opt.name,
                choiceName: opt.choices[0].name
            }));
            setSelectedOptions(defaultOptions);
          }
        }
        setLoading(false);
      };
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product && product.options) {
      let price = product.price;
      selectedOptions.forEach(selectedOpt => {
        const option = product.options?.find(opt => opt.name === selectedOpt.optionName);
        const choice = option?.choices.find(c => c.name === selectedOpt.choiceName);
        if (choice) {
          price += choice.priceModifier;
        }
      });
      setCurrentPrice(price);
    }
  }, [selectedOptions, product]);


  const handleOptionChange = (optionName: string, choiceName: string) => {
    setSelectedOptions(prev => {
        const otherOptions = prev.filter(opt => opt.optionName !== optionName);
        return [...otherOptions, { optionName, choiceName }];
    });
  };
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1, selectedOptions, currentPrice || product.price);
      toast({
        title: "تمت الإضافة للسلة",
        description: `تمت إضافة "${product.name}" إلى سلة التسوق.`,
      });
    }
  };
  
  const renderStars = () => {
    if (!product) return null;
    const stars = [];
    const rating = product.rating || 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-primary text-primary" />);
    }
    if (halfStar) {
      stars.push(<StarHalf key="half" className="h-5 w-5 fill-primary text-primary" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-muted" />);
    }
    return stars;
  };
  
  if (loading) {
    return (
        <div className="container mx-auto px-4 py-12" dir="rtl">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <div>
                    <Skeleton className="w-full h-[400px] md:h-[500px] rounded-lg" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="w-full rounded-lg object-cover shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-headline font-bold">{product.name}</h1>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1">
                {renderStars()}
             </div>
             <span className="text-muted-foreground">({product.reviews || 0} مراجعات)</span>
          </div>
          <p className="text-lg text-muted-foreground">{product.description}</p>
          
          {product.options && product.options.map(option => (
            <div key={option.name}>
                <Label className="text-lg font-semibold">{option.name}</Label>
                <RadioGroup 
                    defaultValue={selectedOptions.find(o => o.optionName === option.name)?.choiceName}
                    onValueChange={(value) => handleOptionChange(option.name, value)}
                    className="mt-2 grid grid-cols-3 gap-2"
                >
                    {option.choices.map(choice => (
                        <div key={choice.name} className="relative">
                            <RadioGroupItem value={choice.name} id={`${option.name}-${choice.name}`} className="sr-only" />
                             <Label htmlFor={`${option.name}-${choice.name}`} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <span>{choice.name}</span>
                                {choice.priceModifier !== 0 && <span className="text-xs text-primary">({choice.priceModifier > 0 ? '+' : ''}{choice.priceModifier.toFixed(2)} ر.س)</span>}
                             </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
          ))}

          <div className="flex items-baseline gap-4 pt-4">
            <span className="text-4xl font-bold text-primary">{currentPrice?.toFixed(2)} ر.س</span>
            { (product.options && currentPrice && currentPrice > product.price) && 
                <span className="text-xl text-muted-foreground line-through">{product.price.toFixed(2)} ر.س</span>
            }
          </div>

          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="ml-2 h-5 w-5" />
            أضف للسلة
          </Button>
        </div>
      </div>
    </div>
  );
}
