import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from 'typeorm';
import { OrderEntity } from './order-entity';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';
import { Exclude } from 'class-transformer';

@Entity('order_combo')
export class OrderCombo {

    @ManyToOne(() => OrderEntity, order => order.order_products, { eager: true, lazy: true })
    @JoinColumn({ name: 'order_id' })
    @Exclude()
    order: OrderEntity;

    @ManyToOne(() => Combo, combo => combo.orders, { eager: true })
    @JoinColumn({ name: 'combo_id' })
    combo: Combo;

    @PrimaryColumn('uuid')
    order_id: string;

    @PrimaryColumn('uuid')
    combo_id: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    combo_price: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: number;
<<<<<<< HEAD
    
=======
>>>>>>> eb6487b6eeb771d2a390cfc9a7bacaa531607f4a
}
