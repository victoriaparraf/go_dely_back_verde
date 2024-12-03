import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';

@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    order_id: string;

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'varchar', length: 10 })
    currency: string;

    @Column({ type: 'decimal', precision: 10})
    total: number;

    @Column({ type: 'varchar', length: 50 })
    paymentMethodId: string;

    @OneToMany(() => Product, (product) => product.order, { nullable: true })
    products: Product[];

    @OneToMany(() => Product, (combo) => combo.order, { nullable: true })
    combos: Combo[];
}