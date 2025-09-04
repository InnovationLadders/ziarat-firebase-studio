
'use server';

import { collection, getDocs, doc, writeBatch, query, where, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from './types';

const initialProducts: Omit<Product, 'id'>[] = [
    {
      name: 'صندوق شوكولاتة فاخر',
      description: 'تشكيلة متنوعة من الشوكولاتة البلجيكية الفاخرة.',
      price: 250,
      image: 'https://s.alicdn.com/@sc04/kf/HTB1F8seKk9WBuNjSspeq6yz5VXaa/Wholesale-Custom-Printed-Luxury-Book-Shaped-Folding-Chocolate-Packing-Box-Bulk-Rigid-Paper-Magnetic-Gift-Packaging-Chocolate-Box.jpg',
      dataAiHint: 'luxury chocolate',
      category: 'مناسبات خاصة',
      rating: 4.8,
      reviews: 120,
      tags: ['شوكولاتة', 'فاخر', 'منتج'],
       options: [
        {
          name: 'الحجم',
          choices: [
            { name: 'صغير', priceModifier: 0 },
            { name: 'وسط', priceModifier: 50 },
            { name: 'كبير', priceModifier: 100 },
          ],
        },
      ],
    },
    {
      name: 'سلة فواكه موسمية',
      description: 'سلة أنيقة مليئة بأفضل الفواكه الموسمية الطازجة.',
      price: 180,
      image: 'https://picsum.photos/400/400?random=2',
      dataAiHint: 'fruit basket',
      category: 'زيارة مريض',
      rating: 4.6,
      reviews: 95,
      tags: ['فواكه', 'صحي', 'زيارة'],
    },
    {
      name: 'باقة ورد جوري أحمر',
      description: 'باقة منسقة من أجود أنواع الورد الجوري الأحمر.',
      price: 300,
      image: 'https://cdn.salla.sa/wQYpe/971a56aa-88e9-4198-ba85-cb5e0de724b1-1000x1000-UgGCUwRCCyFwHIcDc7MrINCRumB7i2XwOaKwXAtn.jpg',
      dataAiHint: 'red roses',
      category: 'عامة',
      rating: 4.9,
      reviews: 250,
      tags: ['ورد', 'رومانسي', 'جوري'],
       options: [
        {
          name: 'تنسيق الباقة',
          choices: [
            { name: 'تغليف أساسي', priceModifier: 0 },
            { name: 'مع فازة زجاجية', priceModifier: 70 },
          ],
        },
         {
          name: 'إضافة بطاقة',
          choices: [
            { name: 'بدون', priceModifier: 0 },
            { name: 'بطاقة صغيرة', priceModifier: 15 },
            { name: 'بطاقة كبيرة', priceModifier: 25 },
          ],
        },
      ],
    },
    {
      name: 'مجموعة العناية بالطفل',
      description: 'صندوق منتجات يحتوي على أساسيات العناية بالوليد الجديد.',
      price: 350,
      image: 'https://picsum.photos/400/400?random=4',
      dataAiHint: 'baby care',
      category: 'مولود جديد',
      rating: 4.7,
      reviews: 180,
      tags: ['مولود', 'عناية', 'منتج'],
    },
    {
      name: 'مجموعة القهوة المختصة',
      description: 'مجموعة لعشاق القهوة تحتوي على بن مختص وأدوات تحضير.',
      price: 220,
      image: 'https://picsum.photos/400/400?random=5',
      dataAiHint: 'coffee set',
      category: 'مناسبات خاصة',
      rating: 4.8,
      reviews: 150,
      tags: ['قهوة', 'مختصة', 'منتج'],
    },
    {
      name: 'صندوق تمور فاخرة',
      description: 'تشكيلة من أفضل أنواع التمور المحشوة بالمكسرات.',
      price: 150,
      image: 'https://picsum.photos/400/400?random=6',
      dataAiHint: 'luxury dates',
      category: 'زيارة مريض',
      rating: 4.7,
      reviews: 200,
      tags: ['تمور', 'فاخر', 'منتج'],
    },
    {
      name: 'باقة زهور متنوعة',
      description: 'باقة زهور ملونة ومنعشة لمختلف المناسبات.',
      price: 190,
      image: 'https://picsum.photos/400/400?random=7',
      dataAiHint: 'flower bouquet',
      category: 'عامة',
      rating: 4.6,
      reviews: 130,
      tags: ['زهور', 'ملون', 'منتج'],
    },
    {
      name: 'منتج مولود (بنت)',
      description: 'صندوق وردي أنيق يحتوي على ملابس وألعاب لمولودة جديدة.',
      price: 400,
      image: 'https://picsum.photos/400/400?random=8',
      dataAiHint: 'baby girl gift',
      category: 'مولود جديد',
      rating: 4.9,
      reviews: 220,
      tags: ['مولود', 'بنت', 'منتج'],
    },
     {
      name: 'عرض خاص: شوكولا وورد',
      description: 'باقة ورد صغيرة مع علبة شوكولاتة بسعر خاص.',
      price: 120,
      image: 'https://picsum.photos/400/400?random=9',
      dataAiHint: 'chocolate flowers',
      category: 'عامة',
      rating: 4.5,
      reviews: 80,
      tags: ['عرض', 'شوكولاتة', 'ورد'],
    },
  ];

async function seedInitialProducts() {
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(query(productsRef));
    
    if (productsSnapshot.empty) {
        console.log("Products collection is empty. Seeding initial products...");
        const writeBatch = writeBatch(db);
        
        initialProducts.forEach((product) => {
            const docRef = doc(productsRef);
            writeBatch.set(docRef, product);
        });
        
        await writeBatch.commit();
        console.log('Initial products have been seeded.');
    }
}


export async function getProducts(category?: string): Promise<Product[]> {
  try {
    // First, attempt to seed data if the collection is empty.
    // This might fail if write permissions are not set, but getDocs will still try.
    await seedInitialProducts();

    const productsCollection = collection(db, 'products');
    let productsQuery = category && category !== 'الكل'
      ? query(productsCollection, where('category', '==', category))
      : query(productsCollection);
    
    const snapshot = await getDocs(productsQuery);
  
    if (snapshot.empty) {
      // If the snapshot is empty after attempting to seed, it implies either no matching products
      // or a persistent read issue. We'll return the local data as a fallback.
      console.warn(`Firestore: No products found for category: ${category || 'All'}. Falling back to local data.`);
      return getFallbackProducts(category);
    }

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

  } catch (error: any) {
    console.error("Firebase getProducts error:", error.message);
    
    // If the error is specifically a permission error, fall back to the local data.
    if (error.code === 'permission-denied' || error.code === 7) {
        console.warn("Firebase permission denied. Serving local fallback data.");
        return getFallbackProducts(category);
    }
    
    // For other errors, re-throw them or handle as needed.
    throw error;
  }
}

function getFallbackProducts(category?: string): Product[] {
    const fallbackProducts = initialProducts.map((p, index) => ({ ...p, id: `fallback-prod-${index}` }));
    if (category && category !== 'الكل') {
        return fallbackProducts.filter(p => p.category === category);
    }
    return fallbackProducts;
}

export async function getProduct(id: string): Promise<Product | null> {
    try {
        const productRef = doc(db, 'products', id);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return { 
                id: docSnap.id,
                ...data,
                options: data.options || [],
            } as Product;
        } else {
            console.warn(`Firestore: Product with id ${id} not found. Checking fallback data.`);
            return getFallbackProducts().find(p => p.id === id) || null;
        }
    } catch (error: any) {
         console.error("Firebase getProduct error:", error.message);
         if (error.code === 'permission-denied' || error.code === 7) {
             console.warn(`Firebase permission denied for id ${id}. Checking fallback data.`);
            return getFallbackProducts().find(p => p.id === id) || null;
         }
         throw error;
    }
}


export async function addProduct(product: Omit<Product, 'id'>) {
    const productsRef = collection(db, 'products');
    await addDoc(productsRef, product);
}

export async function updateProduct(productId: string, product: Partial<Omit<Product, 'id'>>) {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, product);
}

export async function deleteProduct(productId: string) {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
}
