import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CreateCouponService } from '../application/command/create-coupon-service';
import { DeleteCouponService } from '../application/command/delete-coupon-service';
import { GetCouponService } from '../application/query/get-coupon-service';
import { CreateCouponServiceEntryDto } from '../application/dtos/entry/create-coupon-entry.dto';
import { GetCouponServiceEntryDto } from '../application/dtos/entry/get-coupon-entry.dto';


@Controller('coupon')
export class CouponController {
  constructor(
    private readonly createCouponService: CreateCouponService,
    private readonly deleteCouponService:  DeleteCouponService,
    private readonly getCouponService: GetCouponService

  ) {}

  @Post('create')
  create(@Body() createCouponDto: CreateCouponDto) {
    const createCouponEntryDto: CreateCouponServiceEntryDto = {...createCouponDto}
    return this.createCouponService.execute(createCouponEntryDto);
  }

  @Get('many')
  findAll() {
    return this.getCouponService.findAll();
  }

  @Get('one/by/:code')
  findOne(@Param('code') code: string) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!regex.test(code)) {
        throw new Error(`The coupon code must be a valid code not a UUID.`);
    }
    const getCouponEntryDto: GetCouponServiceEntryDto = {code}
    
    return this.getCouponService.execute(getCouponEntryDto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCouponService.execute(id);
  }
}
