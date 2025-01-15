import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../infraestructure/typeorm/order-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from '../../infraestructure/typeorm/order-product';
import { OrderCombo } from '../../infraestructure/typeorm/order-combo';
import { Repository } from 'typeorm';

@Injectable()
export class RemoveOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @InjectRepository(OrderProduct) private readonly orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(OrderCombo) private readonly orderComboRepository: Repository<OrderCombo>
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    await this.orderProductRepository.delete({ order_id: orderId });
    await this.orderComboRepository.delete({ order_id: orderId });
    await this.orderRepository.remove(orderId);
  }
}