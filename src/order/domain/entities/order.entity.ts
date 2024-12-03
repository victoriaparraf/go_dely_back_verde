import { OrderAddress } from "../value-objects/order-address.vo";
import { OrderCurrency } from "../value-objects/order-currency.vo";
import { OrderPaymentMethod } from "../value-objects/order-payment-methos.vo";
import { OrderTotal } from "../value-objects/order-total.vo";


export class Order {
    order_id: string;
    address: OrderAddress;
    currency: OrderCurrency;
    total: OrderTotal;
    paymentMethod: OrderPaymentMethod;

    constructor(
        id: string,
        address: string,
        currency: string,
        total: number,
        paymentMethod: string,
    ) {
        this.order_id = id;
        this.address = new OrderAddress(address);
        this.currency = new OrderCurrency(currency);
        this.total = new OrderTotal(total);
        this.paymentMethod = new OrderPaymentMethod(paymentMethod);
    }
}