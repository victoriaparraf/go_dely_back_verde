import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreateCouponDto {

    @IsString()
    @MinLength(1)
    coupon_code: string;

    @IsNumber()
    @IsPositive()
    coupon_amount: number;

    @IsDate()
    @IsNotEmpty()
    coupon_expiration_date: Date;


}
