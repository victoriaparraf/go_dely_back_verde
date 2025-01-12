import {Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address-entity";
import { OrderEntity } from "src/order/infraestructure/typeorm/order-entity";
import { Notification } from 'src/notification/infraestructure/typeorm/notification.entity';

@Entity('user')
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ type: 'varchar', unique: true })
    user_email: string;

    @Column({ type: 'varchar' })
    user_name: string;

    @Column({ type: 'varchar' })
    user_phone: string;

    @Column('text', {
        select: false
    })
    user_password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    user_image: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    user_role: string;

    @Column('text', {
        default: 'active'
    })
    user_status: string;

    @OneToMany(() => Address, address => address.user, { cascade: true }) 
    addresses: Address[];

    @OneToMany(() => Notification, (notification) => notification.user, { cascade: true })
    notification_token: Notification[];

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity[];

}