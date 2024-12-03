import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './infraestructure/controller/order.controller';
import { OrderService } from './application/order.service';
import { OrderEntity } from './infraestructure/typeorm/order-entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
