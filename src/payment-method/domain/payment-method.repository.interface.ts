import { PaymentMethod } from "./payment-method.aggregate";

export interface PaymentMethodRepositoryInterface {
    findById(id: string): Promise<PaymentMethod | null>;
    findByName(name: string): Promise<PaymentMethod | null>;
    save(paymentMethod: PaymentMethod): Promise<void>;
    findAll(): Promise<PaymentMethod[]>;
    update(paymentMethod: PaymentMethod): Promise<void>;
    delete(id: string): Promise<void>;
}
