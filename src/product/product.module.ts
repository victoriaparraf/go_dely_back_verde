import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entities/product.entity';
import { Image } from './domain/entities/image.entity';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { RabbitmqModule } from './infrastructure/rabbitmq/rabbitmq.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { Combo } from 'src/combo/domain/entities/combo.entity';
import { ProductService } from './application/services/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports:[
    TypeOrmModule.forFeature([ Product, Image, Combo ]),
    CloudinaryModule,
    RabbitmqModule,
    MailModule
  ]
})
export class ProductModule {}
