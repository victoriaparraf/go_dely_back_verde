import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '../domain/payment-method.aggregate';
import { PaymentMethodName } from '../domain/value-objects/payment-method-name.vo';
import { PaymentMethodIcon } from '../domain/value-objects/payment-method-icon.vo';
import { PaymentMethodRepositoryInterface } from '../domain/payment-method.repository.interface';

@Injectable()
export class PaymentMethodService {
    constructor(private readonly paymentMethodRepository: PaymentMethodRepositoryInterface) {}

    async createPaymentMethod(id: string, name: string, icon: string): Promise<void> {
        const paymentMethod = new PaymentMethod(id, new PaymentMethodName(name), new PaymentMethodIcon(icon), true);
        await this.paymentMethodRepository.save(paymentMethod);
    }

    async getPaymentMethod(id: string): Promise<PaymentMethod | null> {
        return await this.paymentMethodRepository.findById(id);
    }

    async getAllPaymentMethods(): Promise<PaymentMethod[]> {
        return await this.paymentMethodRepository.findAll();
    }

    async deactivatePaymentMethod(id: string): Promise<void> {
        const paymentMethod = await this.paymentMethodRepository.findById(id);
        if (!paymentMethod) {
            throw new Error('Payment method not found.');
        }

        paymentMethod.deactivate();
        await this.paymentMethodRepository.save(paymentMethod);
    }
}
