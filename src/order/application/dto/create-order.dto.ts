import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, IsUUID, Min, MinLength, ValidateNested } from "class-validator";

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

    @IsString()
    @MinLength(6)
    paymentMethodId: string;

    @IsString()
    @MinLength(3)
    currency: string;

    @IsNumber()
    @Min(0)
    total: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    order_products?: ProductDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ComboDto)
    order_combos?: ComboDto[];

}