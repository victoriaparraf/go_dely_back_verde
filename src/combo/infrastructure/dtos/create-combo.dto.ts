import { IsString, IsArray, ArrayNotEmpty, MinLength, IsPositive, IsNumber, IsInt, IsOptional, IsUUID, Length, IsDateString } from 'class-validator';
import { Currency } from 'src/common/domain/enums/currency.enum';

export class CreateComboDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    description: string;

    @IsNumber()
    @IsPositive()
    weight: number;

    @IsString()
    @Length(2, 2)
    measurement: string;

    @IsString()
    currency: Currency;

    @IsArray()
    @ArrayNotEmpty()
    category: string[];

    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?: number;

    @IsDateString()
    @IsOptional()
    caducityDate?: Date | string;

    @IsArray()
    @IsString({ each:true })
    images: string[];

    @IsArray()
    @ArrayNotEmpty()
    productId: string[];

    @IsString()
    @IsOptional()
    discount: string;
}