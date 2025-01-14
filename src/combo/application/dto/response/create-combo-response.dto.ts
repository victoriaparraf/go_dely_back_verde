import { Currency } from "src/common/domain/enums/currency.enum";

export class CreateComboServiceResponseDto {

    id: string;
    name: string;
    price: number;
    weight: number;
    measurement: string;
    currency: Currency;
    description: string;
    stock: number;
    images: string[];
    productId: string[];
    category: string[];
    caducityDate?: string;
    // discount: number | null;

}