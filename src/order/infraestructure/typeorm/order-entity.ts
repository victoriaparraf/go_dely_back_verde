import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { OrderStatus } from 'src/order/domain/enums/order-status.enum';
import { User } from 'src/user/infrastructure/typeorm/user-entity';
import { OrderProduct } from './order-product';
import { OrderCombo } from './order-combo';
import { Exclude } from 'class-transformer';

@Entity('orders')
export class OrderEntity {

    @PrimaryGeneratedColumn('uuid')
    order_id: string;

    @Column({ type: 'varchar', nullable: false })
    address: string;

    @Column({ type: 'decimal', nullable: false })
    longitude: number;

    @Column({ type: 'decimal', nullable: false })
    latitude: number;

    @Column({ type: 'varchar', length: 3, nullable: false })
    currency: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'varchar', length: 250 })
    paymentMethod: string;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
    status: OrderStatus;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, { cascade: true, onDelete: 'CASCADE' })
    @Exclude()
    order_products: OrderProduct[];

    @OneToMany(() => OrderCombo, orderCombo => orderCombo.order, { cascade: true, onDelete: 'CASCADE' })
    @Exclude()
    order_combos: OrderCombo[];

    @Column({ type: 'varchar', length: 50, nullable: true })
    cupon_code?: string;

}
