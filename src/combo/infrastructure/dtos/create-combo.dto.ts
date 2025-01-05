import { IsString, IsArray, ArrayNotEmpty, MinLength, IsPositive, IsNumber, IsInt, IsOptional, IsUUID } from 'class-validator';

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

    @IsUUID()
    combo_category: string;

    @IsInt()
    @IsOptional()
    @IsPositive()
    combo_stock?: number;

    @IsString()
    combo_image: string;

    @IsArray()
    @ArrayNotEmpty()
    products: string[];
}