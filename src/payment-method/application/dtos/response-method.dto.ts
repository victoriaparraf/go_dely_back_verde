import { PaymentMethod } from "src/payment-method/domain/payment-method.aggregate";

export class PaymentMethodResponseDTO {
    readonly id: string;
    readonly name: string;
    readonly icon: string;
    readonly active: boolean;

    constructor(data: {
        id: string;
        name: string;
        icon: string;
        active: boolean;
    }) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.active = data.active;
    }

    static fromDomain(paymentMethod: PaymentMethod): PaymentMethodResponseDTO {
        return new PaymentMethodResponseDTO({
            id: paymentMethod.id, 
            name: paymentMethod.getName(),
            icon: paymentMethod.getIcon(),
            active: paymentMethod.isActive(),
        });
    }
}
