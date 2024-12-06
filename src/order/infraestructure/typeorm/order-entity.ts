import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { OrderStatus } from 'src/order/domain/enums/order-status.enum';
import { User } from 'src/user/infrastructure/typeorm/user.entity';
import { OrderProduct } from './order-product';
import { OrderCombo } from './order-combo';

@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    order_id: string;

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'varchar', length: 10 })
    currency: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'varchar', length: 50 })
    paymentMethodId: string;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
    status: OrderStatus;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, { cascade: true, onDelete: 'CASCADE' })
    order_products: OrderProduct[];

    @OneToMany(() => OrderCombo, orderCombo => orderCombo.order, { cascade: true, onDelete: 'CASCADE' })
    order_combos: OrderCombo[];
}