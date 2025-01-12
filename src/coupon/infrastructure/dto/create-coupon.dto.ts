import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateCouponDto {

    @IsString()
    @MinLength(1)
    code: string;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @IsNotEmpty()
    expiration_date: Date;

    @IsNumber()
    @IsPositive()
    amount: number;
    
}
