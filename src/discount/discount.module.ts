import { Module } from '@nestjs/common';
import { DiscountController } from './infraestructure/discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './infraestructure/typeorm/discount.entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';
import { CreateDiscountService } from './application/commands/create-discount.service';

@Module({
  controllers: [DiscountController],
  providers: [CreateDiscountService],
  imports: [
    TypeOrmModule.forFeature([ Discount, Product, Combo ]),
  ]
})
export class DiscountModule {}
