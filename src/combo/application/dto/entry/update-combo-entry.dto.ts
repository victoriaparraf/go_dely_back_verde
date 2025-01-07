import { Currency } from "src/common/domain/enums/currency.enum";

export class UpdateComboServiceEntryDto {

    combo_id: string;
    combo_name?: string;
    combo_description?: string;
    combo_price?: number;
    combo_weight?: number;
    combo_measurement?: string;
    combo_stock?: number;
    combo_currency?: Currency;
    combo_categories?: string[];
    combo_image?: string;
    products?: string[];
    combo_caducity_date?: Date;
    // discount: number | null;
    
}