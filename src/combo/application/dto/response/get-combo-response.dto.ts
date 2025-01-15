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
    productId: string[];
    category: string[];
    caducityDate?: string | Date;
    discountId?: string;
    discountPercentage?: number;

}