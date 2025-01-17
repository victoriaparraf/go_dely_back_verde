import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../infraestructure/typeorm/order-repository';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import { UserRepository } from 'src/user/infrastructure/typeorm/user.repository';
import { SendNotificationService } from 'src/notification/application/services/send-notification.service';

@Injectable()
export class UpdateOrderStatusService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly sendNotificationService: SendNotificationService,
  ) {}

  async execute(orderId: string, newStatus: OrderStatus): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.setStatus(newStatus);

    const user = await this.orderRepository.findOrderUser(order);
    const userNotification = user.notification_token[0].token;
    
    if (!userNotification) {
      console.warn(`User ${user.user_id} does not have a notification token. Skipping push notification.`);
    } else {
      await this.sendNotificationService.notifyUsersAboutNewStatus(newStatus, userNotification);
    toString()
    }

    await this.orderRepository.save(order);
  }
}