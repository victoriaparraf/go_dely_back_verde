import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './infraestructure/controller/order.controller';
import { OrderService } from './application/order.service';
import { OrderEntity } from './infraestructure/typeorm/order-entity';
import { OrderRepository } from './infraestructure/typeorm/order-repository';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), PaymentMethodModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository]
})
export class OrderModule {}
