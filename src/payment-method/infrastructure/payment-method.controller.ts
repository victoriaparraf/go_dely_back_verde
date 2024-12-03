import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDTO } from '../application/dtos/payment-method.dto';
import { PaymentMethodResponseDTO } from '../application/dtos/response-method.dto';
import { UpdatePaymentMethodDTO } from '../application/dtos/update-method.dto';

@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  async getAllPaymentMethods(): Promise<PaymentMethodResponseDTO[]> {
    const paymentMethods = await this.paymentMethodService.getAllPaymentMethods();
    return paymentMethods.map(PaymentMethodResponseDTO.fromDomain);
  }

  @Post()
  async createPaymentMethod(@Body() createDTO: CreatePaymentMethodDTO): Promise<{ message: string }> {
    await this.paymentMethodService.createPaymentMethod(createDTO);
    return { message: 'Payment method created successfully' };
  }

  @Get(':id')
  async getPaymentMethod(@Param('id') id: string): Promise<PaymentMethodResponseDTO | null> {
    const paymentMethod = await this.paymentMethodService.getPaymentMethod(id);
    if (!paymentMethod) return null;

    return PaymentMethodResponseDTO.fromDomain(paymentMethod);
  }

  @Patch(':id')
  async updatePaymentMethod(@Param('id') id: string, @Body() updateDTO: UpdatePaymentMethodDTO): Promise<{ message: string }> {
    await this.paymentMethodService.updatePaymentMethod(id, updateDTO.name, updateDTO.icon);
    return { message: 'Payment method updated successfully' };
  }

  @Patch(':id/deactivate')
  async deactivatePaymentMethod(@Param('id') id: string): Promise<{ message: string }> {
    await this.paymentMethodService.deactivatePaymentMethod(id);
    return { message: 'Payment method deactivated successfully' };
  }

  @Patch(':id/activate')
  async activatePaymentMethod(@Param('id') id: string): Promise<{ message: string }> {
    await this.paymentMethodService.activatePaymentMethod(id);
    return { message: 'Payment method activated successfully' };
  }

  @Delete(':id')
  async deletePaymentMethod(@Param('id') id: string): Promise<{ message: string }> {
    await this.paymentMethodService.deletePaymentMethod(id);
    return { message: 'Payment method deleted successfully' };
  }

}
