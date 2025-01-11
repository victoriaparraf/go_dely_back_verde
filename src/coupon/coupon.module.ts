import { Delete, Module } from '@nestjs/common';

import { CouponController } from './infrastructure/coupon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './infrastructure/Typeorm/coupon.entity';
import { CouponRepository } from './infrastructure/repositories/coupon-repository';
import { CreateCouponService } from './application/command/create-coupon-service';
import { DeleteCouponService } from './application/command/delete-coupon-service';
import { GetCouponService } from './application/query/get-coupon-service';

@Module({
  controllers: [CouponController],
  providers: [ CouponRepository, CreateCouponService, DeleteCouponService,GetCouponService],
  imports:[TypeOrmModule.forFeature([ Coupon ])],
  exports: [CouponRepository]
})
export class CouponModule {}
