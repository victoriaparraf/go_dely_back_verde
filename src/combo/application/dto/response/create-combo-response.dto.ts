import { Currency } from "src/common/domain/enums/currency.enum";

export class CreateComboServiceResponseDto {

    id: string;
    name: string;
    price: number;
    currency: Currency;
    description: string;
    stock: number;
    image: string;
    products: string[];
    categories: string[];
    // discount: number | null;

}