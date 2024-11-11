import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


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
    product_currency: string;

    @IsString()
    product_weight: string;

    @IsInt()
    @IsOptional()
    @IsPositive()
    product_stock?: number;

    @IsString({ each:true })
    @IsArray()
    images: string[];

}
