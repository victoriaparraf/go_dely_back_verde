import { IsString, IsDecimal, IsArray, ArrayNotEmpty, IsOptional, MinLength, IsPositive, IsNumber } from 'class-validator';

export class CreateComboDto {

    @IsString()
    @MinLength(1)
    combo_name: string;

    @IsNumber()
    @IsPositive()
    combo_price: number;

    @IsString()
    combo_description: string;

    @IsArray()
    @ArrayNotEmpty()
    products: string[];
}