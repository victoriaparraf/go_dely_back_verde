import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ICouponRepository } from "src/coupon/domain/repositories/coupon-repositori-interface";
import { Coupon } from "../typeor/coupon.entity";
import { Repository } from "typeorm";
import { isUUID } from "class-validator";


@Injectable()
export class CouponRepository implements ICouponRepository {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async createCoupon(coupon: Coupon): Promise<Coupon> {
    return this.couponRepository.create(coupon);
  }

  async saveCoupon(coupon: Coupon): Promise<Coupon> {
    return this.couponRepository.save(coupon);
  }

  async findAllCoupon(): Promise<Coupon[]> {
    return this.couponRepository.find();
  }

  async findOneCoupon(term: string): Promise<Coupon | undefined> {
    let coupon: Coupon;
    if (isUUID(term)) {
      coupon = await this.couponRepository.findOne({
        where: { coupon_id: term },
      });
    } else {
      coupon = await this.couponRepository
        .createQueryBuilder('coupon') 
        .where('coupon.coupon_code = :coupon_code', { coupon_code: term })
        .getOne();
    }
    return coupon;
  }

  async removeCoupon(coupon: Coupon): Promise<Coupon> {
    return this.couponRepository.remove(coupon);
  }
  
}