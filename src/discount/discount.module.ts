import { Module } from '@nestjs/common';
import { DiscountController } from './infraestructure/discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './infraestructure/typeorm/discount.entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';
import { CreateDiscountService } from './application/commands/create-discount.service';
import { CommonModule } from 'src/common/common.module';
import { NotificationModule } from 'src/notification/notification.module';
import { DiscountRepository } from './infraestructure/repositories/discount-repository';
import { GetDiscountService } from './application/query/get-discount.service';
import { UpdateDiscountService } from './application/commands/update-discount.service';
import { DeleteDiscountService } from './application/commands/delete-discount.service';

@Module({
  controllers: [DiscountController],
  providers: [CreateDiscountService, DiscountRepository , GetDiscountService, UpdateDiscountService, DeleteDiscountService],
  imports: [
    TypeOrmModule.forFeature([ Discount, Product, Combo ]),
    CommonModule,
    NotificationModule
  ],
  exports: [CreateDiscountService, DiscountRepository, GetDiscountService, UpdateDiscountService, DeleteDiscountService],
})
export class DiscountModule {}
