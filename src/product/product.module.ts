import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './infrastructure/typeorm/product-entity'; 
import { Image } from './infrastructure/typeorm/image-entity'; 
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { RabbitmqModule } from './infrastructure/rabbitmq/rabbitmq.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { ProductRepository } from './infrastructure/typeorm/product-repositoy';
import { CreateProductService } from './application/command/create-product-service';
import { GetProductService } from './application/query/get-product-service';
import { GetProductsByCategoryService } from './application/query/get-products-by-category-service';
import { UpdateProductService } from './application/command/update-product-service';

@Module({
  controllers: [ProductController],
  providers: [CreateProductService, GetProductService, GetProductsByCategoryService, UpdateProductService, ProductRepository],
  imports:[
    TypeOrmModule.forFeature([ Product, Image, Combo, CategoryEntity ]),
    CloudinaryModule,
    RabbitmqModule,
    MailModule
  ],
  exports: [ProductRepository, CreateProductService, GetProductService, GetProductsByCategoryService, UpdateProductService],
})
export class ProductModule {}
