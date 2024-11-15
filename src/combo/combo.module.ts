import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboService } from './infrastructure/combo.service';
import { Combo } from './infrastructure/typeorm/combo-entity';
import { ComboController } from './infrastructure/combo.controller';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combo, Product])],
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}