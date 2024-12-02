import { Module } from '@nestjs/common';
import { ProductService } from './infrastructure/product.service';
import { ProductController } from './infrastructure/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './infrastructure/typeorm/product-entity'; 
import { Image } from './infrastructure/typeorm/image-entity'; 
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { RabbitmqModule } from './infrastructure/rabbitmq/rabbitmq.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports:[
    TypeOrmModule.forFeature([ Product, Image, Combo, CategoryEntity ]),
    CloudinaryModule,
    RabbitmqModule,
    MailModule
  ]
})
export class ProductModule {}
