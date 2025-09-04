import { getProducts } from '@/lib/product-service';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreVertical, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteProductButton } from './_components/delete-product-button';


export default async function AdminDashboard() {
  const products = await getProducts();

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            إضافة منتج جديد
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">الصورة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price.toFixed(2)} ر.س</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>تعديل</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                         <DeleteProductButton productId={product.id} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
