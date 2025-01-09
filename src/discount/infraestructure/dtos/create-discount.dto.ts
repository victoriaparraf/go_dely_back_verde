import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateDiscountDto {

    @IsString()
    @IsNotEmpty()
    discount_name: string;

    @IsString()
    @IsNotEmpty()
    discount_description: string;

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

    @IsString()
    @IsOptional()
    image: string;
}
