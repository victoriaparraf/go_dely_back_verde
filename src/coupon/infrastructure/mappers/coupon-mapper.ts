import { GetCouponServiceResponseDto } from "src/coupon/application/dtos/response/get-coupon-response.dto";
import { Coupon } from "../typeor/coupon.entity";

export class CouponMapper {
  static mapCouponToResponse(coupon: Coupon): GetCouponServiceResponseDto {
    return {
      cuponId: coupon.coupon_id,
      code: coupon.coupon_code.getValue().toString(),
      amount: Number(coupon.coupon_amount.getValue()),
      expiration_date: coupon.coupon_expiration_date,
      creation_date: coupon.coupon_creation_date,
    };
  }
}