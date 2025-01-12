import { AggregateRoot } from 'src/common/domain/aggregate.root';
import { CouponID } from './value-objects/coupon-id.vo';
import { CouponCode } from './value-objects/coupon-code.vo';
import { CouponAmount } from './value-objects/coupon-amount.vo';
import { CouponCreationDate } from './value-objects/coupon-creation-date.vo';
import { CouponExpirationDate } from './value-objects/coupon-expiration-date.vo';


export class Coupon extends AggregateRoot<CouponID> {
    private code: CouponCode;
    private amount: CouponAmount;
    private creationDate: CouponCreationDate;
    private expirationDate: CouponExpirationDate;

    constructor(
        id: CouponID,
        code: CouponCode,
        amount: CouponAmount,
        creationDate: CouponCreationDate,
        expirationDate: CouponExpirationDate
    ) {
        super(id);
        this.code = code;
        this.amount = amount;
        this.creationDate = creationDate;
        this.expirationDate = expirationDate;
    }

    static create(
        coupon_id: string,
        code: string,
        amount: number,
        creationDate: Date,
        expirationDate: Date
    ) :Coupon{
        return new Coupon(
        new CouponID(coupon_id),
        new CouponCode(code) ,
        new CouponAmount(amount),
        new CouponCreationDate(creationDate),
        new CouponExpirationDate(expirationDate)
        )
    }

    static reconstitute(
        coupon_id: string,
        code: string,
        amount: number,
        creationDate: Date,
        expirationDate: Date
    ) :Coupon{
        return new Coupon(
        new CouponID(coupon_id),
        new CouponCode(code) ,
        new CouponAmount(amount),
        new CouponCreationDate(creationDate),
        new CouponExpirationDate(expirationDate)
        )
    }

    get couponCode(): CouponCode {
        return this.code;
    }

    get couponAmount(): CouponAmount {
        return this.amount;
    }

    get couponCreationDate(): CouponCreationDate {
        return this.creationDate;
    }

    get couponExpirationDate(): CouponExpirationDate {
        return this.expirationDate;
    }
}
