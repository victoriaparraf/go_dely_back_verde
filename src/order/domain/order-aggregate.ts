import { AggregateRoot } from 'src/common/domain/aggregate.root';
import { OrderID } from './value-objects/order-id.vo';
import { OrderAddress } from './value-objects/order-address.vo';
import { OrderCurrency } from './value-objects/order-currency.vo';
import { OrderTotal } from './value-objects/order-total.vo';
import { PaymentMethodId } from 'src/payment-method/domain/value-objects/payment-method-id.vo';
import { UserId } from 'src/user/domain/value-object/user-id';

export class Order extends AggregateRoot<OrderID> {
    private address: OrderAddress;
    private currency: OrderCurrency;
    private total: OrderTotal;
    private paymentMethodId: PaymentMethodId;
    private user_id: UserId;

    constructor(
        id: OrderID,
        address: OrderAddress,
        currency: OrderCurrency,
        total: OrderTotal,
        paymentMethodId: PaymentMethodId,
        user_id: UserId
    ) {
        super(id);
        this.address = address;
        this.currency = currency;
        this.total = total;
        this.paymentMethodId = paymentMethodId;
        this.user_id = user_id;
    }

    static create(
        address: string,
        currency: string,
        total: number,
        paymentMethod: string,
        user_id: string,
    ): Order {
        return new Order(
            OrderID.create(),
            new OrderAddress(address),
            new OrderCurrency(currency),
            new OrderTotal(total),
            new PaymentMethodId(paymentMethod),
            new UserId(user_id),
        );
    }

    static reconstitute(
        id: string,
        address: string,
        currency: string,
        total: number,
        paymentMethod: string,
        user_id: string,
    ): Order {
        return new Order(
            new OrderID(id),
            new OrderAddress(address),
            new OrderCurrency(currency),
            new OrderTotal(total),
            new PaymentMethodId(paymentMethod),
            new UserId(user_id),
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

    getPaymentMethodId(): PaymentMethodId {
        return this.paymentMethodId;
    }

    updateAddress(newAddress: string): void {
        this.address = new OrderAddress(newAddress);
    }

    updateTotal(newTotal: number): void {
        this.total = new OrderTotal(newTotal);
    }

    getUserId(): UserId {
        return this.user_id;
    }
}