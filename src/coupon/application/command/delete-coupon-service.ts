import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CouponRepository } from "src/coupon/infrastructure/repositories/coupon-repository";



@Injectable()
export class DeleteCouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(couponId: string): Promise<void> {
    const coupon = await this.couponRepository.findOneCoupon(couponId);
    if (!coupon) {
      throw new NotFoundException(`Coupon with id ${couponId} not found`);
    }
    try {
        await this.couponRepository.removeCoupon(coupon);
    } catch (error) {
        console.log('Error deleting coupon', error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }
    
  }
}