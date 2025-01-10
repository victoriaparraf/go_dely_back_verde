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
    products: string[];
    categories: string[];
    caducity_date?: string;
    // discount: number | null;

}