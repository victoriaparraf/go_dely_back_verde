import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboService } from './infrastructure/combo.service';
import { Combo } from './infrastructure/typeorm/combo-entity';
import { ComboController } from './infrastructure/combo.controller';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { CloudinaryModule } from 'src/product/infrastructure/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Combo, Product]),CloudinaryModule],
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}