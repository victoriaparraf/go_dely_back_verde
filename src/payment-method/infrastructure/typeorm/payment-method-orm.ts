import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('payment_methods')
export class PaymentMethodEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    name: string;

    @Column()
    icon: string;

    @Column({ default: true })
    active: boolean;
    
}
