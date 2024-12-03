import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatePaymentMethodDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    icon: string;
}
