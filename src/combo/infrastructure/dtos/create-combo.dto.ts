import { IsString, IsArray, ArrayNotEmpty, MinLength, IsPositive, IsNumber, IsInt, IsOptional, IsUUID, Length, IsDateString } from 'class-validator';
import { Currency } from 'src/common/domain/enums/currency.enum';

export class CreateComboDto {

    @IsString()
    @MinLength(1)
    combo_name: string;

    @IsNumber()
    @IsPositive()
    combo_price: number;

    @IsString()
    combo_description: string;

    @IsNumber()
    @IsPositive()
    combo_weight: number;

    @IsString()
    @Length(2, 2)
    combo_measurement: string;

    @IsString()
    combo_currency: Currency;

    @IsArray()
    @ArrayNotEmpty()
    combo_categories: string[];

    @IsInt()
    @IsOptional()
    @IsPositive()
    combo_stock?: number;

    @IsDateString()
    @IsOptional()
    combo_caducity_date: Date;

    @IsString()
    combo_image: string;

    @IsArray()
    @ArrayNotEmpty()
    products: string[];
}