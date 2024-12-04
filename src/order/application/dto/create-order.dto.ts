import { IsNumber, IsString, IsUUID, Min, MinLength } from "class-validator";


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

    @IsUUID()
    user_id: string;
}