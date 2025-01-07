import { Currency } from "src/common/domain/enums/currency.enum";

export class UpdateComboServiceEntryDto {

    combo_id: string;
    combo_name?: string;
    combo_description?: string;
    combo_price?: number;
    combo_stock?: number;
    combo_currency?: Currency;
    combo_categories?: string[];
    combo_image?: string;
    products?: string[];
    // discount: number | null;
    
}