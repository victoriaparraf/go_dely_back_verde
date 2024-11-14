import { IsString, IsArray, ArrayNotEmpty, MinLength, IsPositive, IsNumber } from 'class-validator';

export class CreateComboDto {

    @IsString()
    @MinLength(1)
    combo_name: string;

    @IsNumber()
    @IsPositive()
    combo_price: number;

    @IsString()
    combo_description: string;

    @IsString()
    combo_currency: string;

    @IsString()
    combo_category: string;

    @IsString()
    combo_image: string;

    @IsArray()
    @ArrayNotEmpty()
    products: string[];
}