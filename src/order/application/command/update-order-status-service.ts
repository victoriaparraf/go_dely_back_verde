import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../infraestructure/typeorm/order-repository';
import { OrderStatus } from '../../domain/enums/order-status.enum';

@Injectable()
export class UpdateOrderStatusService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string, newStatus: OrderStatus): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.setStatus(newStatus);
    await this.orderRepository.save(order);
  }
}