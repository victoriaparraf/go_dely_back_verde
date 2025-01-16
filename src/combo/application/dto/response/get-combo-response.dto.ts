import { Currency } from "src/common/domain/enums/currency.enum";

export class GetComboServiceResponseDto {

    id: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    measurement: string;
    currency: Currency;
    stock: number;
    images: string[];
    products: string[];
    categories: string[];
    caducityDate?: string | Date;
    discount?: string;
    discountPercentage?: number;

}