import { Currency } from "src/common/domain/enums/currency.enum";

export class CreateComboServiceEntryDto {

    name: string;
    description: string;
    price: number;
    currency: Currency;
    stock: number;
    category: string;
    image: string;
    products: string[];
    //discount: number | undefined;
    
}