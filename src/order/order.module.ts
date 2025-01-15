import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './infraestructure/controller/order.controller';
import { OrderEntity } from './infraestructure/typeorm/order-entity';
import { OrderRepository } from './infraestructure/typeorm/order-repository';
import { PaymentMethodModule } from 'src/payment-method/payment-method.module';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { OrderProduct } from './infraestructure/typeorm/order-product';
import { OrderCombo } from './infraestructure/typeorm/order-combo';
import { ComboModule } from 'src/combo/combo.module';
import { CreateOrderService } from './application/command/create-order-service';
import { CouponModule } from 'src/coupon/coupon.module';
import { UpdateOrderStatusService } from './application/command/update-order-status-service';
import { RemoveOrderService } from './application/command/delete-order-service';
import { UpdateOrderService } from './application/command/update-order-service';
import { GetOrderService } from './application/query/get-order-service';

@Module({
  imports: [ TypeOrmModule.forFeature([OrderEntity, OrderProduct, OrderCombo]), PaymentMethodModule, UserModule, ProductModule, CouponModule, ComboModule ],
  controllers: [ OrderController ],
  providers: [
    GetOrderService,
    CreateOrderService,
    UpdateOrderService,
    RemoveOrderService,
    UpdateOrderStatusService,
    OrderRepository
  ],
  exports: [ OrderRepository ]

})
export class OrderModule {}
