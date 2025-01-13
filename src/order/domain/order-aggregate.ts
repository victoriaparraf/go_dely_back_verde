import { AggregateRoot } from 'src/common/domain/aggregate.root';
import { OrderID } from './value-objects/order-id.vo';
import { OrderCurrency } from './value-objects/order-currency.vo';
import { OrderTotal } from './value-objects/order-total.vo';
import { UserId } from 'src/user/domain/value-object/user-id';
import { OrderStatus } from './enums/order-status.enum';
import { OrderProduct } from '../infraestructure/typeorm/order-product';
import { OrderCombo } from '../infraestructure/typeorm/order-combo';
import { Address } from 'src/user/infrastructure/typeorm/address-entity';
import { PaymentMethodName } from 'src/payment-method/domain/value-objects/payment-method-name.vo';

export class Order extends AggregateRoot<OrderID> {
    private address: Address;
    private longitude: number;
    private latitude: number;
    private currency: OrderCurrency;
    private total: OrderTotal;
    private paymentMethod: PaymentMethodName;
    private user_id: UserId;
    private status: OrderStatus;
    private order_products: OrderProduct[];
    private order_combos: OrderCombo[]; 
    order_id: string;

    constructor(
        id: OrderID,
        address: Address,
        longitude: number,
        latitude: number,
        currency: OrderCurrency,
        total: OrderTotal,
        paymentMethod: PaymentMethodName,
        user_id: UserId,
        status: OrderStatus = OrderStatus.CREATED,
        order_products: OrderProduct[] = [],
        order_combos: OrderCombo[] = [],

    ) {
        super(id);
        this.address = address;
        this.longitude = longitude;
        this.latitude = latitude;
        this.currency = currency;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.user_id = user_id;
        this.status = status;
        this.order_products = order_products;
        this.order_combos = order_combos;
    }

    static create(
        address: Address,
        longitude : number,
        latitude : number,
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
            address,
            longitude,
            latitude,
            new OrderCurrency(currency),
            new OrderTotal(total),
            new PaymentMethodName(paymentMethod),
            new UserId(user_id),
            status,
            order_products,
            order_combos
        );
    }

    static reconstitute(
        id: string,
        address: Address,
        longitude : number,
        latitude : number,
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
            address,
            longitude,
            latitude,
            new OrderCurrency(currency),
            new OrderTotal(total),
            new PaymentMethodName(paymentMethod),
            new UserId(user_id),
            status,
            order_products,
            order_combos
        );
    }

    getLongitude(): number{
        return this.longitude;
    }

    getLatitude(): number{
        return this.latitude;
    }

    getId(): OrderID {
        return this.id;
    }

    getAddress(): Address {
        return this.address;
    }

    getCurrency(): OrderCurrency {
        return this.currency;
    }

    getTotal(): number {
        return this.total.value;
    }

    getPaymentMethodName(): PaymentMethodName {
        return this.paymentMethod;
    }

    updateCurrency(newCurrency: string): void {
        this.currency = new OrderCurrency(newCurrency);
    }

    updatePaymentMethodId(newPaymentMethodId: string): void {
        this.paymentMethod = new PaymentMethodName(newPaymentMethodId);
    }

    updateAddress(newAddress: Address): void {
        this.address = newAddress;
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