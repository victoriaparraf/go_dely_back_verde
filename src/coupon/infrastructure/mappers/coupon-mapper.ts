import { GetCouponServiceResponseDto } from "src/coupon/application/dtos/response/get-coupon-response.dto";
import { Coupon } from "../Typeorm/coupon.entity";



export class CouponMapper {
    static mapCouponToResponse(coupon: Coupon): GetCouponServiceResponseDto {
      return {
        coupon_id: coupon.coupon_id,
        coupon_code: coupon.coupon_code.getValue(),
        coupon_amount: coupon.coupon_amount.getValue(),
        coupon_creation_date: coupon.coupon_creation_date.getValue(),
        coupon_expiration_date: coupon.coupon_expiration_date.getValue(),
      };
    }
  }