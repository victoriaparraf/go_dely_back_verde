import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './infraestructure/controller/order.controller';
import { OrderService } from './application/order.service';
import { OrderEntity } from './infraestructure/typeorm/order-entity';
import { OrderRepository } from './infraestructure/typeorm/order-repository';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ TypeOrmModule.forFeature([OrderEntity]), PaymentMethodModule, UserModule ],
  controllers: [ OrderController ],
  providers: [ OrderService, OrderRepository ],
  exports: [ OrderRepository ]
})
export class OrderModule {}
