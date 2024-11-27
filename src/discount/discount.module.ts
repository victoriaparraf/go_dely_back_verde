import { Module } from '@nestjs/common';
import { DiscountService } from './infraestructure/discount.service';
import { DiscountController } from './infraestructure/discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './infraestructure/typeorm/discount.entity';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService],
  imports: [
    TypeOrmModule.forFeature([ Discount ]),
  ]
})
export class DiscountModule {}
