import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboService } from './infrastructure/combo.service';
import { Combo } from './domain/entities/combo.entity';
import { ComboController } from './infrastructure/combo.controller';
import { Product } from 'src/product/domain/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combo, Product])],
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}