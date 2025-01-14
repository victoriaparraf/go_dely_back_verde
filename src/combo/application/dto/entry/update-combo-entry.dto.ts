import { Currency } from "src/common/domain/enums/currency.enum";

export class UpdateComboServiceEntryDto {

    id: string;
    name?: string;
    description?: string;
    price?: number;
    weight?: number;
    measurement?: string;
    stock?: number;
    currency?: Currency;
    category?: string[];
    images?: string[];
    productId?: string[];
    caducityDate?: Date | string;
    // discount: number | null;
    
}