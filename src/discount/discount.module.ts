import { Module } from '@nestjs/common';
import { DiscountService } from './infraestructure/discount.service';
import { DiscountController } from './infraestructure/discount.controller';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
