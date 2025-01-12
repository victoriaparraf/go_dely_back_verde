import { Entity } from 'src/common/domain/entity';
import { CouponID } from '../value-objects/coupon-id.vo';
import { CouponCode } from '../value-objects/coupon-code.vo';
import { CouponAmount } from '../value-objects/coupon-amount.vo';
import { CouponCreationDate } from '../value-objects/coupon-creation-date.vo';
import { CouponExpirationDate } from '../value-objects/coupon-expiration-date.vo';


export class Coupon extends Entity<CouponID> {
    readonly code: CouponCode;
    readonly amount: CouponAmount;
    readonly creationDate: CouponCreationDate;
    readonly expirationDate: CouponExpirationDate;

    constructor(
        coupon_id: string,
        code: string,
        amount: number,
        creationDate: Date,
        expirationDate: Date
    ) {
        super(new CouponID(coupon_id));
        this.code = new CouponCode(code) ;
        this.amount = new CouponAmount(amount);
        this.creationDate = new CouponCreationDate(creationDate);
        this.expirationDate = new CouponExpirationDate(expirationDate);
    }
}
