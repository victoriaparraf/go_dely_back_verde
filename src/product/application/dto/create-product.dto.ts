import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, Length, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    product_name: string;

    @IsString()
    product_description: string;

    @IsNumber()
    @IsPositive()
    product_price: number;

    @IsString()
    @Length(3, 3)
    product_currency: string;

    @IsString()
    product_weight: string;

    @IsString()
    @Length(2, 2)
    product_measurement: string;

    @IsInt()
    @IsOptional()
    @IsPositive()
    product_stock?: number;

    @IsString({ each:true })
    @IsArray()
    images: string[];

    @IsString()
    product_category: string;

}
