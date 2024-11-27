import { IsDate, IsNotEmpty, IsNumber, IsPositive, MinDate } from "class-validator";

export class CreateDiscountDto {

    @IsNumber()
    @IsPositive()
    discount_percentage: number;

    @IsDate()
    @IsNotEmpty()
    @MinDate(new Date(), { message: 'La fecha de inicio debe ser igual o posterior a hoy' })
    discount_start_date: Date;

    @IsDate()
    @IsNotEmpty()
    discount_end_date: Date;
}
