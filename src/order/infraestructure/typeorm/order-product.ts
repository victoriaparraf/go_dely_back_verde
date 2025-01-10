import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from 'typeorm';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { OrderEntity } from './order-entity';
import { Exclude } from 'class-transformer';

@Entity('order_product')
export class OrderProduct {

    @ManyToOne(() => OrderEntity, order => order.order_products, { eager: true, lazy: true })
    @JoinColumn({ name: 'order_id' })
    @Exclude()
    order: OrderEntity;

    @ManyToOne(() => Product, product => product.orders, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @PrimaryColumn('uuid')
    order_id: string;

    @PrimaryColumn('uuid')
    product_id: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    product_price: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: number;
    orderProduct: import("/Users/sofiaarasme/Desktop/GoDely/godely_back/go_dely_back_verde/src/order/domain/order-aggregate").Order;
}
