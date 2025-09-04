'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';


interface CategorySidebarProps {
    categories: string[];
    selectedCategory?: string;
}

export function CategorySidebar({ categories, selectedCategory }: CategorySidebarProps) {
  
  const currentCategory = selectedCategory || 'الكل';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <List className="ml-2 h-5 w-5" />
          التصنيفات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={category === 'الكل' ? '/#featured' : `/?category=${encodeURIComponent(category)}#featured`}
                className={cn(
                  "flex items-center justify-between text-muted-foreground hover:text-primary transition-colors",
                  currentCategory === category && "text-primary font-bold"
                )}
                scroll={false}
              >
                <span>{category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
