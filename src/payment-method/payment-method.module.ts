import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodService } from './infrastructure/payment-method.service';
import { PaymentMethodController } from './infrastructure/payment-method.controller';
import { PaymentMethodEntity } from './infrastructure/typeorm/payment-method-orm';
import { PaymentMethodRepository } from './infrastructure/typeorm/payment-method.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService, PaymentMethodRepository],
  exports: [PaymentMethodService, PaymentMethodRepository],
})
export class PaymentMethodModule {}
