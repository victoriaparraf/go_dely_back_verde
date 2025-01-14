import { Currency } from "src/common/domain/enums/currency.enum";

export class CreateComboServiceEntryDto {

    name: string;
    description: string;
    price: number;
    weight: number;
    measurement: string;
    currency: Currency;
    stock?: number;
    category: string[];
    images: string[];
    productId: string[];
    caducityDate?: Date | string;
    //discount: number | undefined;
    
}