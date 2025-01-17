import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from './infrastructure/typeorm/combo-entity';
import { ComboController } from './infrastructure/controller/combo.controller';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { ComboRepository } from './infrastructure/repositories/combo-repository';
import { CreateComboService } from './application/commands/create-combo.service';
import { GetComboService } from './application/query/get-combo-service';
import { UpdateComboService } from './application/commands/update-combo.service';
import { DeleteComboService } from './application/commands/delete-combo.service';
import { CommonModule } from 'src/common/common.module';
import { Discount } from 'src/discount/infraestructure/typeorm/discount.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { OrderModule } from 'src/order/order.module';
import { GetPopularCombosService } from './application/query/get-popular-combos-service';

@Module({
  providers: [ GetPopularCombosService, CreateComboService, ComboRepository, GetComboService, UpdateComboService, DeleteComboService],
  imports: [
    TypeOrmModule.forFeature([Combo, Product, CategoryEntity, Discount]),
    CommonModule,
    NotificationModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [ComboController],
  exports: [ GetPopularCombosService, CreateComboService, ComboRepository, GetComboService, UpdateComboService, DeleteComboService],
})
export class ComboModule {}