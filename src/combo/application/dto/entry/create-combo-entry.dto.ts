import { Currency } from "src/common/domain/enums/currency.enum";

export class CreateComboServiceEntryDto {

    combo_name: string;
    combo_description: string;
    combo_price: number;
    combo_currency: Currency;
    combo_stock?: number;
    combo_category: string;
    combo_image: string;
    products: string[];
    //discount: number | undefined;
    
}