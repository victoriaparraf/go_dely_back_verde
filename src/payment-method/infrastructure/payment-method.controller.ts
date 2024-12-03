import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDTO } from '../application/dtos/payment-method.dto';
import { PaymentMethodResponseDTO } from '../application/dtos/response-method.dto';
import { UpdatePaymentMethodDTO } from '../application/dtos/update-method.dto';

@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  async createPaymentMethod(@Body() createDTO: CreatePaymentMethodDTO): Promise<void> {
    await this.paymentMethodService.createPaymentMethod(createDTO);
  }

  @Get(':id')
  async getPaymentMethod(@Param('id') id: string): Promise<PaymentMethodResponseDTO | null> {
    const paymentMethod = await this.paymentMethodService.getPaymentMethod(id);
    if (!paymentMethod) return null;

    return PaymentMethodResponseDTO.fromDomain(paymentMethod);
  }

  @Patch(':id')
  async updatePaymentMethod(@Param('id') id: string, @Body() updateDTO: UpdatePaymentMethodDTO): Promise<void> {
    await this.paymentMethodService.updatePaymentMethod(id, updateDTO.name, updateDTO.icon);
  }
}
