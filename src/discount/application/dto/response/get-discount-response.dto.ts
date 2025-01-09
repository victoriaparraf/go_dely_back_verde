export class GetDiscountServiceResponseDto {

    id: string;
    name: string;
    description: string;
    percentage: number;
    start_date: Date  | string;
    end_date: Date  | string;
    image?: string;
    products?: string[];
    combos?: string[];

}