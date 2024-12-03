import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethod } from '../domain/payment-method.aggregate';
import { PaymentMethodName } from '../domain/value-objects/payment-method-name.vo';
import { PaymentMethodIcon } from '../domain/value-objects/payment-method-icon.vo'
import { CreatePaymentMethodDTO } from '../application/dtos/payment-method.dto';
import { PaymentMethodId } from '../domain/value-objects/payment-method-id.vo';
import { PaymentMethodRepository } from './typeorm/payment-method.repository';

@Injectable()
export class PaymentMethodService {
    constructor(
        private readonly paymentMethodRepository: PaymentMethodRepository,
    ) {}

    async createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDTO): Promise<PaymentMethod> {
    const { name, icon } = createPaymentMethodDto;
    const paymentMethodName = new PaymentMethodName(name);
    const paymentMethodIcon = new PaymentMethodIcon(icon);

    const paymentMethodId = PaymentMethodId.generate();
    const isActive = true;
    const paymentMethodAggregate = new PaymentMethod(
        paymentMethodId.value,
        paymentMethodName,
        paymentMethodIcon,
        isActive
    );

    await this.paymentMethodRepository.save(paymentMethodAggregate);
    return paymentMethodAggregate;
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
            throw new NotFoundException(`Payment method with ID ${id} not found`);
        }
        paymentMethod.deactivate();
        await this.paymentMethodRepository.save(paymentMethod);
    }

    async updatePaymentMethod(id: string, name: string, icon: string): Promise<void> {
        const paymentMethod = await this.paymentMethodRepository.findById(id);
        if (!paymentMethod) {
            throw new NotFoundException(`Payment method with ID ${id} not found`);
        }
        paymentMethod.updateName(new PaymentMethodName(name));
        paymentMethod.updateIcon(new PaymentMethodIcon(icon));
        await this.paymentMethodRepository.save(paymentMethod);
    }
}