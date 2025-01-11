import { Coupon } from "src/coupon/infrastructure/Typeorm/coupon.entity";



export interface ICouponRepository {
    createCoupon(coupon: Coupon): Promise<Coupon>;
    saveCoupon(coupon: Coupon): Promise<Coupon>;
    findAllCoupon(): Promise<Coupon[]>;
    findOneCoupon(term: string): Promise<Coupon | undefined>;
    removeCoupon(coupon: Coupon): Promise<Coupon>;
  }
  
  