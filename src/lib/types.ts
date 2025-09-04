

export interface ProductOptionChoice {
  name: string;
  priceModifier: number;
}

export interface ProductOption {
  name: string;
  choices: ProductOptionChoice[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  tags: string[];
  dataAiHint?: string;
  options?: ProductOption[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  dataAiHint?: string;
}

export type SelectedOption = {
  optionName: string;
  choiceName: string;
}
