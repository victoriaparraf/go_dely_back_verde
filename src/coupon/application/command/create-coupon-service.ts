import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IApplicationService } from "src/common/application/application-service.interface";
import { CouponRepository } from "src/coupon/infrastructure/repositories/coupon-repository";
import { CreateCouponServiceEntryDto } from "../dtos/entry/create-coupon-entry.dto";
import { CreateCouponServiceResponseDto } from "../dtos/response/create-coupon-response.dto";
import { CouponCode } from "src/coupon/domain/value-objects/coupon-code.vo";
import { CouponAmount } from '../../domain/value-objects/coupon-amount.vo';
import { CouponCreationDate } from '../../domain/value-objects/coupon-creation-date.vo';
import { CouponExpirationDate } from '../../domain/value-objects/coupon-expiration-date.vo';
import { Coupon } from "src/coupon/infrastructure/typeor/coupon.entity";




@Injectable()
export class CreateCouponService implements IApplicationService<CreateCouponServiceEntryDto,CreateCouponServiceResponseDto>{
  constructor(private couponRepository: CouponRepository) {}

  async execute(createCouponEntryDto: CreateCouponServiceEntryDto): Promise<CreateCouponServiceResponseDto> {

    try {
        const couponCode = new CouponCode(createCouponEntryDto.code);
        const couponAmount = new CouponAmount(createCouponEntryDto.amount);
        const couponCreationDate = new CouponCreationDate(new Date());
        const couponExpirationDate = new CouponExpirationDate(createCouponEntryDto.expiration_date);

        const coupon = new Coupon();
        coupon.coupon_code = couponCode;
        coupon.coupon_amount = couponAmount;    
        coupon.coupon_creation_date = couponCreationDate.getValue();   
        coupon.coupon_expiration_date = couponExpirationDate.getValue();

        await this.couponRepository.saveCoupon(coupon);

        return { coupon_id: coupon.coupon_id };

    } catch (error) {
        console.log('Error creating coupon');
        this.handleDBExceptions(error);
        
    }
    
  }

  
  private handleDBExceptions(error: any): void {
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

