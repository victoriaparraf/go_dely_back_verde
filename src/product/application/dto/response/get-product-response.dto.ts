export class GetProductServiceResponseDto {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    weight: number;
    measurement: string;
    stock: number;
    categories: string[];
    images: string[];
    discount: number | null;
  }