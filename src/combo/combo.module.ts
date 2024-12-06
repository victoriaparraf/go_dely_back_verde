import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboService } from './infrastructure/combo.service';
import { Combo } from './infrastructure/typeorm/combo-entity';
import { ComboController } from './infrastructure/combo.controller';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { CloudinaryModule } from 'src/product/infrastructure/cloudinary/cloudinary.module';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { ComboRepository } from './infrastructure/typeorm/combo-repository';

@Module({
  providers: [ComboService, ComboRepository],
  imports: [TypeOrmModule.forFeature([Combo, Product, CategoryEntity]),CloudinaryModule],
  controllers: [ComboController],
  exports: [ComboService, ComboRepository],
})
export class ComboModule {}