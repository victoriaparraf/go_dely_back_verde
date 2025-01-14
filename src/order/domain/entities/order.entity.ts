import { UserId } from "src/user/domain/value-object/user-id";
import { OrderCurrency } from "../value-objects/order-currency.vo";
import { OrderTotal } from "../value-objects/order-total.vo";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id.vo";
import { Address } from "src/user/infrastructure/typeorm/address-entity";

export class OrderEntity {
    order_id: string;
    address: string;
    currency: OrderCurrency;
    total: OrderTotal;
    paymentMethodId: PaymentMethodId;
    user_id: UserId;
    status: OrderStatus;

    constructor(
        id: string,
        address: string,
        currency: string,
        total: number,
        paymentMethodId: string,
        user_id: string,
        status: OrderStatus
    ) {
        this.order_id = id;
        this.address = address;
        this.currency = new OrderCurrency(currency);
        this.total = new OrderTotal(total);
        this.paymentMethodId = new PaymentMethodId(paymentMethodId);
        this.user_id = new UserId(user_id);
        this.status = status;
    }
}