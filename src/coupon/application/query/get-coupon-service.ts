import { Injectable, NotFoundException } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { GetCouponServiceEntryDto } from '../dtos/entry/get-coupon-entry.dto';
import { GetCouponServiceResponseDto } from '../dtos/response/get-coupon-response.dto';
import { CouponRepository } from 'src/coupon/infrastructure/repositories/coupon-repository';
import { CouponMapper } from 'src/coupon/infrastructure/mappers/coupon-mapper';



@Injectable()
export class GetCouponService implements IApplicationService<GetCouponServiceEntryDto, GetCouponServiceResponseDto> {
  constructor(
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(getCouponEntryDto: GetCouponServiceEntryDto): Promise<GetCouponServiceResponseDto> {
    const coupon = await this.couponRepository.findOneCoupon(getCouponEntryDto.code);
    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${getCouponEntryDto.code} not found`);
    }
    return CouponMapper.mapCouponToResponse(coupon);
  }

  async findAll(): Promise<GetCouponServiceResponseDto[]> {
    const coupons = await this.couponRepository.findAllCoupon();
    return coupons.map(coupon => CouponMapper.mapCouponToResponse(coupon));
  }

}
