import { UserId } from "src/user/domain/value-object/user-id";
import { OrderAddress } from "../value-objects/order-address.vo";
import { OrderCurrency } from "../value-objects/order-currency.vo";
import { OrderTotal } from "../value-objects/order-total.vo";
import { PaymentMethod } from "src/payment-method/domain/payment-method.aggregate";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id.vo";


export class OrderEntity {
    order_id: string;
    address: OrderAddress;
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
        this.address = new OrderAddress(address);
        this.currency = new OrderCurrency(currency);
        this.total = new OrderTotal(total);
        this.paymentMethodId = new PaymentMethodId(paymentMethodId);
        this.user_id = new UserId(user_id);
        this.status = status;
    }
}