
'use server';

import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, writeBatch, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Category } from './types';

const initialCategories: Omit<Category, 'id'>[] = [
    { name: "مناسبات خاصة", image: "https://picsum.photos/300/300?random=3", dataAiHint: "gift box" },
    { name: "زيارة مريض", image: "https://picsum.photos/300/300?random=2", dataAiHint: "get well soon" },
    { name: "مولود جديد", image: "https://picsum.photos/300/300?random=1", dataAiHint: "new baby" },
    { name: "عامة", image: "https://picsum.photos/300/300?random=4", dataAiHint: "occasion gift" }
];

async function seedInitialCategories() {
    const categoriesRef = collection(db, 'categories');
    try {
        const q = query(categoriesRef);
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("Categories collection is empty. Seeding initial categories...");
            const batch = writeBatch(db);
            initialCategories.forEach(category => {
                const docRef = doc(categoriesRef);
                batch.set(docRef, category);
            });
            await batch.commit();
            console.log("Initial categories have been seeded.");
        }
    } catch (error) {
        console.error("Could not seed categories, likely due to permissions. The app will use fallback data.", error);
    }
}

export async function getCategories(): Promise<Category[]> {
    try {
        await seedInitialCategories();
        
        const categoriesCollection = collection(db, 'categories');
        const snapshot = await getDocs(categoriesCollection);

        if (snapshot.empty) {
            console.warn("Categories collection is empty. Returning fallback categories.");
            return initialCategories.map((c, index) => ({ id: `fallback-cat-${index}`, ...c }));
        }

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error: any) {
        console.error("Firebase getCategories error:", error.message);
        if (error.code === 'permission-denied' || error.code === 7) {
             console.warn("Firebase permission denied. Serving local fallback categories.");
             return initialCategories.map((c, index) => ({ id: `fallback-cat-error-${index}`, ...c }));
        }
       throw error;
    }
}

export async function addCategory(category: Omit<Category, 'id'>) {
    const categoriesRef = collection(db, 'categories');
    await addDoc(categoriesRef, category);
}

export async function updateCategory(categoryId: string, category: Partial<Omit<Category, 'id'>>) {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, category);
}

export async function deleteCategory(categoryId: string) {
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
}
