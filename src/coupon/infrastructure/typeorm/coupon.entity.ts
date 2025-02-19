import { CouponAmount } from "src/coupon/domain/value-objects/coupon-amount.vo";
import { CouponCode } from "src/coupon/domain/value-objects/coupon-code.vo";
import { OrderEntity } from "src/order/infraestructure/typeorm/order-entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coupon {

    @PrimaryGeneratedColumn('uuid')
    coupon_id: string;

    @Column({
        type: 'varchar',
        transformer: {
            to: (value: CouponCode) => value.getValue(),
            from: (value: string) => value ? new CouponCode(value) : new CouponCode('FirstGoDely'),
        },
    })
    coupon_code: CouponCode;
    
    
    @Column({
        type: 'decimal',
        default: 0.00,
        transformer: {
            to: (value: CouponAmount) => value.getValue(),
            from: (value: number) => new CouponAmount(value)
        },
    })
    coupon_amount: CouponAmount;

    @Column({ type: 'date' })
    coupon_expiration_date: Date;

    @Column({ type: 'date' })
    coupon_creation_date: Date;

    @OneToMany(() => OrderEntity, order => order.cupon_code)
    orders: OrderEntity[];
}
