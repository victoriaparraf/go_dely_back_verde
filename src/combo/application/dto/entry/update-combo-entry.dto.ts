import { Currency } from "src/common/domain/enums/currency.enum";

export class UpdateComboServiceEntryDto {

    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    currency: Currency;
    category: string;
    image: string;
    products: string[];
    discount: number | null;
    
}