import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';

@Controller('payment-methods')
export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) {}

    @Post()
    async createPaymentMethod(
        @Body() { id, name, icon }: { id: string; name: string; icon: string }
    ): Promise<void> {
        await this.paymentMethodService.createPaymentMethod(id, name, icon);
    }

    @Get(':id')
    async getPaymentMethod(@Param('id') id: string) {
        return this.paymentMethodService.getPaymentMethod(id);
    }

    @Get()
    async getAllPaymentMethods() {
        return this.paymentMethodService.getAllPaymentMethods();
    }

    @Patch(':id/deactivate')
    async deactivatePaymentMethod(@Param('id') id: string): Promise<void> {
        await this.paymentMethodService.deactivatePaymentMethod(id);
    }
}
