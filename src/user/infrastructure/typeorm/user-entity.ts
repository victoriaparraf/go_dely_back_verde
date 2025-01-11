
import {Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address-entity";
import { UserName } from "src/user/domain/value-object/user-name";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { UserEmail } from "src/user/domain/value-object/user-email";
import { OrderEntity } from "src/order/infraestructure/typeorm/order-entity";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    user_email: UserEmail;

    @Column({ type: 'varchar', length: 255, nullable: false })
    user_name: UserName;

    @Column('text', {
        select: false
    })
    user_password: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    user_phone: UserPhone;

    @Column({ type: 'varchar', length: 255, nullable: true })
    user_image: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    user_type: string;

    @Column('text', {
        default: 'active'
    })
    user_status: string;

    @OneToMany(() => Address, address => address.user, { cascade: true }) 
    addresses: Address[];

    @Column('simple-array', { nullable: true })
    notification_tokens?: string[];

    @OneToMany(() => OrderEntity, (order) => order.user)
    orders: OrderEntity[];

}