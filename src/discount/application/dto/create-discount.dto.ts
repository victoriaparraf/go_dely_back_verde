import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class CreateDiscountDto {

    @IsNumber()
    @IsPositive()
    discount_percentage: number;

    @IsDateString()
    @IsNotEmpty()
    discount_start_date: string;

    @IsDateString()
    @IsNotEmpty()
    discount_end_date: string;
    
    @IsArray()
    @IsOptional()
    products?: string[];

    @IsArray()
    @IsOptional()
    combos?: string[];
}
