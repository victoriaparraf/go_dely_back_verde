import { PaymentMethod } from "./payment-method.aggregate";

export interface PaymentMethodRepositoryInterface {
    findById(id: string): Promise<PaymentMethod | null>;
    save(paymentMethod: PaymentMethod): Promise<void>;
    findAll(): Promise<PaymentMethod[]>;
}
