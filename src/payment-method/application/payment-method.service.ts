import { PaymentMethod } from "../domain/payment-method.aggregate";
import { PaymentMethodRepositoryInterface } from "../domain/payment-method.repository.interface";
import { PaymentMethodIcon } from "../domain/value-objects/payment-method-icon.vo";
import { PaymentMethodName } from "../domain/value-objects/payment-method-name.vo";

export class PaymentMethodService {
    constructor(private paymentMethodRepository: PaymentMethodRepositoryInterface) {}

    async createPaymentMethod(id: string, name: string, icon: string): Promise<void> {
        const paymentMethod = new PaymentMethod(id, new PaymentMethodName(name), new PaymentMethodIcon(icon), true);
        await this.paymentMethodRepository.save(paymentMethod);
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
