import { AggregateRoot } from 'src/common/domain/aggregate.root';
import { OrderID } from './value-objects/order-id.vo';
import { OrderAddress } from './value-objects/order-address.vo';
import { OrderCurrency } from './value-objects/order-currency.vo';
import { OrderTotal } from './value-objects/order-total.vo';
import { PaymentMethodId } from 'src/payment-method/domain/value-objects/payment-method-id.vo';
import { UserId } from 'src/user/domain/value-object/user-id';
import { OrderStatus } from './enums/order-status.enum';
import { OrderProduct } from '../infraestructure/typeorm/order-product';
import { OrderCombo } from '../infraestructure/typeorm/order-combo';

export class Order extends AggregateRoot<OrderID> {
    private address: OrderAddress;
    private currency: OrderCurrency;
    private total: OrderTotal;
    private paymentMethodId: PaymentMethodId;
    private user_id: UserId;
    private status: OrderStatus;
    private order_products: OrderProduct[];
    private order_combos: OrderCombo[]; 

    constructor(
        id: OrderID,
        address: OrderAddress,
        currency: OrderCurrency,
        total: OrderTotal,
        paymentMethodId: PaymentMethodId,
        user_id: UserId,
        status: OrderStatus = OrderStatus.CREATED,
        order_products: OrderProduct[] = [],
        order_combos: OrderCombo[] = [],

    ) {
        super(id);
        this.address = address;
        this.currency = currency;
        this.total = total;
        this.paymentMethodId = paymentMethodId;
        this.user_id = user_id;
        this.status = status;
        this.order_products = order_products;
        this.order_combos = order_combos;
    }

    static create(
        address: string,
        currency: string,
        total: number,
        paymentMethod: string,
        user_id: string,
        status: OrderStatus = OrderStatus.CREATED,
        order_products: OrderProduct[] = [],
        order_combos: OrderCombo[] = [],

    ): Order {
        return new Order(
            OrderID.create(),
            new OrderAddress(address),
            new OrderCurrency(currency),
            new OrderTotal(total),
            new PaymentMethodId(paymentMethod),
            new UserId(user_id),
            status,
            order_products,
            order_combos
        );
    }

    static reconstitute(
        id: string,
        address: string,
        currency: string,
        total: number,
        paymentMethod: string,
        user_id: string,
        status: OrderStatus,
        order_products: OrderProduct[] = [],
        order_combos: OrderCombo[] = []
        

    ): Order {
        return new Order(
            new OrderID(id),
            new OrderAddress(address),
            new OrderCurrency(currency),
            new OrderTotal(total),
            new PaymentMethodId(paymentMethod),
            new UserId(user_id),
            status,
            order_products,
            order_combos
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

    getTotal(): number {
        return this.total.value;
    }

    getPaymentMethodId(): PaymentMethodId {
        return this.paymentMethodId;
    }

    updateCurrency(newCurrency: string): void {
        this.currency = new OrderCurrency(newCurrency);
    }

    updatePaymentMethodId(newPaymentMethodId: string): void {
        this.paymentMethodId = new PaymentMethodId(newPaymentMethodId);
    }

    updateAddress(newAddress: string): void {
        this.address = new OrderAddress(newAddress);
    }

    getUserId(): UserId {
        return this.user_id;
    }

    getStatus(): OrderStatus {
        return this.status;
    }

    setStatus(newStatus: OrderStatus): void {
        this.status = newStatus;
    }

    updateStatus(newStatus: OrderStatus): void {
        this.status = newStatus;
    }

    addOrderProduct(orderProduct: OrderProduct) {
        if (!this.order_products) {
            this.order_products = [];
        }
        this.order_products.push(orderProduct);
    }

    getOrderProducts(): OrderProduct[] {
        return this.order_products;
    }

    addOrderCombo(orderCombo: OrderCombo) {
        if (!this.order_combos) {
            this.order_combos = [];
        }
        this.order_combos.push(orderCombo);
    }

    getOrderCombos(): OrderCombo[] {
        return this.order_combos;
    }

    updateTotal(newTotal: number): void {
        this.total = new OrderTotal(newTotal);
    }
}