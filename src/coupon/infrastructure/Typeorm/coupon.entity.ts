import { CouponAmount } from "src/coupon/domain/value-objects/coupon-amount.vo";
import { CouponCode } from "src/coupon/domain/value-objects/coupon-code.vo";
import { CouponCreationDate } from "src/coupon/domain/value-objects/coupon-creation-date.vo";
import { CouponExpirationDate } from "src/coupon/domain/value-objects/coupon-expiration-date.vo";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({
        type: 'date',
        transformer: {
            to: (value: CouponCreationDate) => value instanceof CouponCreationDate ? value.getValue() : value,
            from: (value: Date) => new CouponCreationDate(value),
        },
    })
    coupon_creation_date: CouponCreationDate;
    
    @Column({
        type: 'date',
        transformer: {
            to: (value: CouponExpirationDate) => value instanceof CouponExpirationDate ? value.getValue() : value,
            from: (value: Date) => new CouponExpirationDate(value),
        },
    })
    coupon_expiration_date: CouponExpirationDate;
}
