export class CreateDiscountServiceEntryDto{

    discount_name: string;
    discount_description: string;
    discount_percentage: number;
    discount_start_date: Date | string;
    discount_end_date: Date | string;
    discount_image?: string;
    products?: string[];
    combos?: string[];

}