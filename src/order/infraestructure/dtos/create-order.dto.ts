import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength, ValidateNested } from "class-validator";

class ProductDto {
    @IsUUID()
    product_id: string;

    @IsNumber()
    @Min(0)
    product_price: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}

class ComboDto {
    @IsUUID()
    combo_id: string;

    @IsNumber()
    @Min(0)
    combo_price: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto{
    @IsString()
    @MinLength(6)
    address: string;

    @IsNumber()
    @Min(6)
    longitude: number;

    @IsNumber()
    @Min(6)
    latitude: number;

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
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products?: ProductDto[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ComboDto)
    combos?: ComboDto[];

    @IsString()
    @MinLength(6)
    cupon_code?: string;

}