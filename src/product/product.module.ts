import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './infrastructure/typeorm/product-entity'; 
import { Image } from './infrastructure/typeorm/image-entity'; 
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { CreateProductService } from './application/command/create-product-service';
import { GetProductService } from './application/query/get-product-service';
import { GetProductsByCategoryService } from './application/query/get-products-by-category-service';
import { UpdateProductService } from './application/command/update-product-service';
import { DeleteProductService } from './application/command/delete-product-service';
import { ProductRepository } from './infrastructure/repositories/product-repositoy';
import { GetProductsCombosSummaryService } from './application/query/get-products-combos-service';
import { ComboModule } from 'src/combo/combo.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ProductController],
  providers: [CreateProductService, GetProductService, GetProductsByCategoryService, UpdateProductService, DeleteProductService, GetProductsCombosSummaryService, ProductRepository],
  imports:[
    TypeOrmModule.forFeature([ Product, Image, Combo, CategoryEntity ]),
    CommonModule,
    ComboModule,
  ],
  exports: [ProductRepository, CreateProductService, GetProductService, GetProductsByCategoryService, DeleteProductService, GetProductsCombosSummaryService, UpdateProductService],
})
export class ProductModule {}
