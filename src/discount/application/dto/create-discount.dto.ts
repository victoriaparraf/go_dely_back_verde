import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateDiscountDto {

    @IsNumber()
    @IsPositive()
    discount_percentage: number;

    @IsDateString()
    @IsNotEmpty()
    discount_start_date: Date;

    @IsDateString()
    @IsNotEmpty()
    discount_end_date: Date;
    
    @IsArray()
    @ArrayNotEmpty()
    products: string[];
}
