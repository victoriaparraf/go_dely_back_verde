import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, Min, MinLength, ValidateNested } from "class-validator";


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
}