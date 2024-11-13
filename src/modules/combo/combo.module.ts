import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboService } from './infrastructure/combo.service';
import { Product } from '../product/domain/entities/product.entity';
import { Combo } from './domain/combo.entity';
import { ComboController } from './infrastructure/combo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Combo, Product])],
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}