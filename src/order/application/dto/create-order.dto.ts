import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, Min, MinLength, ValidateNested } from "class-validator";

class ProductDto {
    @IsString()
    id: string;

    @IsNumber()
    quantity: number;
}

class ComboDto {
    @IsString()
    id: string;

    @IsNumber()
    quantity: number;
}

export class CreateOrderDto{
    @IsString()
    @MinLength(6)
    address: string;

    @IsString()
    @MinLength(6)
    paymentMethod: string;

    @IsString()
    @MinLength(3)
    currency: string;

    @IsNumber()
    @Min(0)
    total: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ComboDto)
    combos: ComboDto[];
}