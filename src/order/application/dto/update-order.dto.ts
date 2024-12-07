import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class UpdateOrderDto {
    @IsString()
    @MinLength(6)
    address_id: string;

    @IsString()
    @MinLength(6)
    paymentMethodId: string;

    @IsString()
    @MinLength(3)
    currency: string;

    @IsNumber()
    @Min(0)
    total: number;
}
