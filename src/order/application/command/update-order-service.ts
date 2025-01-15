import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from '../../infraestructure/dtos/update-order.dto';
import { OrderRepository } from '../../infraestructure/typeorm/order-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/user/infrastructure/typeorm/address-entity';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>
  ) {}

  async execute(orderId: string, dto: UpdateOrderDto): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    if (dto.currency) {
      order.updateCurrency(dto.currency);
    }

    if (dto.paymentMethodId) {
      order.updatePaymentMethodId(dto.paymentMethodId);
    }

    if (dto.address_id) {
      const address = await this.addressRepository.findOne({ where: { address_id: dto.address_id } });
      if (!address) {
        throw new Error(`Address with ID ${dto.address_id} not found`);
      }
      order.updateAddress(address.toString());
    }

    if (dto.total !== undefined) {
      order.updateTotal(dto.total);
    }

    await this.orderRepository.save(order);
  }
}