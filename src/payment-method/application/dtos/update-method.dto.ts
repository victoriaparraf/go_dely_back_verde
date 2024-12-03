import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePaymentMethodDTO {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  icon?: string;
}
