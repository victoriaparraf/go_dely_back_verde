export class UpdateDiscountServiceDto{

    discount_id: string;
    disocunt_name?: string;
    discount_description?: string;
    discount_percentage?: number;
    discount_start_date: Date | string;
    discount_end_date: Date | string;
    discount_image?: string;
    products?: string[];
    combos?: string[];

}