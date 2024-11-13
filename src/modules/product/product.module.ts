import { Module } from '@nestjs/common';
import { ProductService } from './infrastructure/product.service';
import { ProductController } from './infrastructure/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entities/product.entity';
import { Image } from './domain/entities/image.entity';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { Combo } from '../combo/domain/combo.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports:[
    TypeOrmModule.forFeature([ Product, Image, Combo ]),
    CloudinaryModule
  ]
})
export class ProductModule {}
