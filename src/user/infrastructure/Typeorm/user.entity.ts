import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address.entity";
import { UserName } from "src/user/domain/value-object/user-name";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { UserEmail } from "src/user/domain/value-object/user-email";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({
        type: 'varchar',
        transformer: {
        to: (value: UserEmail) => value.getValue(),
        from: (value: string) => value ? new UserEmail(value) : new UserEmail('example@gmail.com'),
        },
    })
    user_email: UserEmail;

    @Column({
        type: 'varchar',
        transformer: {
        to: (value: UserName) => value.getValue(),
        from: (value: string) => value ? new UserName(value) : new UserName('Cliente'),
        },
    })
    user_name: UserName;

    @Column('text', {
        select: false
    })
    user_password: string;

    @Column({
        type: 'varchar',
        transformer: {
        to: (value: UserPhone) => value.getValue(),
        from: (value: string) => value ? new UserPhone(value) : new UserPhone('+58 414-2542634'),
        },
    })
    user_phone: UserPhone;

    @Column('text', {
        default: 'client'
    })
    user_type: string;

    @Column('text', {
        default: 'active'
    })
    user_status: string;

    @Column('text', { nullable: true })
    user_image: string;

    @OneToMany(() => Address, address => address.user, { cascade: true }) 
    addresses: Address[];


    // @BeforeInsert()
    // checkEmaill() {
    //     this.user_email = this.user_email.getValue().toLowerCase().trim();
    // }

}