import { Currency } from "src/common/domain/enums/currency.enum";

export class GetComboServiceResponseDto {

    id: string;
    name: string;
    description: string;
    price: number;
    currency: Currency;
    stock: number;
    image: string;
    products: string[];
    categories: string[];
    // discount: number | null;

}