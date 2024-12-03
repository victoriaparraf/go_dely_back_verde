import { AggregateRoot } from 'src/common/domain/aggregate.root';
import { OrderID } from './value-objects/order-id.vo';
import { OrderAddress } from './value-objects/order-address.vo';
import { OrderCurrency } from './value-objects/order-currency.vo';
import { OrderTotal } from './value-objects/order-total.vo';
import { OrderPaymentMethod } from './value-objects/order-payment-methos.vo';

export class Order extends AggregateRoot<OrderID> {
    private address: OrderAddress;
    private currency: OrderCurrency;
    private total: OrderTotal;
    private paymentMethod: OrderPaymentMethod;

    constructor(
        id: OrderID,
        address: OrderAddress,
        currency: OrderCurrency,
        total: OrderTotal,
        paymentMethod: OrderPaymentMethod,
    ) {
        super(id);
        this.address = address;
        this.currency = currency;
        this.total = total;
        this.paymentMethod = paymentMethod;
    }

    static create(
        address: string,
        currency: string,
        total: number,
        paymentMethod: string,
    ): Order {
        return new Order(
            OrderID.create(),
            new OrderAddress(address),
            new OrderCurrency(currency),
            new OrderTotal(total),
            new OrderPaymentMethod(paymentMethod),
        );
    }

    static reconstitute(
        id: string,
        address: string,
        currency: string,
        total: number,
        paymentMethod: string,
    ): Order {
        return new Order(
            new OrderID(id),
            new OrderAddress(address),
            new OrderCurrency(currency),
            new OrderTotal(total),
            new OrderPaymentMethod(paymentMethod),
        );
    }

    getId(): OrderID {
        return this.id;
    }

    getAddress(): OrderAddress {
        return this.address;
    }

    getCurrency(): OrderCurrency {
        return this.currency;
    }

    getTotal(): OrderTotal {
        return this.total;
    }

    getPaymentMethod(): OrderPaymentMethod {
        return this.paymentMethod;
    }

    updateAddress(newAddress: string): void {
        this.address = new OrderAddress(newAddress);
    }

    updateTotal(newTotal: number): void {
        this.total = new OrderTotal(newTotal);
    }
}