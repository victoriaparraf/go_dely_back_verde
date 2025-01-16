import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FirebaseNotificationsService } from '../../../common/infraestructure/firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/notification/infraestructure/typeorm/notification.entity';

@Injectable()
export class SendNotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        private readonly firebaseNotificationsService: FirebaseNotificationsService,
    ) {}

    private async notifyUsers(
        title: string,
        body: string,
        data?: Record<string, string>,
        imageUrl?: string,
        token?: string,
    ): Promise<void> {
        if (token) {
            await this.firebaseNotificationsService.sendNotification(token, title, body, data, imageUrl);
        } else {
            const notifications = await this.notificationRepository.find({
                select: ['token'],
            });

            const tokens = notifications.map(notification => notification.token);

            if (tokens.length === 0) {
                console.log('No hay tokens de notificación registrados.');
                return;
            }

            await this.firebaseNotificationsService.sendNotifications(tokens, title, body, data, imageUrl);
        }
    }

    async notifyUsersAboutNewProduct(product: any): Promise<void> {
        const title = 'GoDely - ¡New Product Available!';
        const body = `Take a look at our new product: ${product.name}`;
        const data = {
            productId: product.id,
            productName: product.name,
        };
        const imageUrl = product.images[0];

        await this.notifyUsers(title, body, data, imageUrl);
    }

    async notifyUsersAboutDiscount(discount: any): Promise<void> {
        const title = 'GoDely - ¡New Offer!';
        const body = `Take advantage of a ${discount.percentage*100}% discount on our selected products`;
        const data = {
            discountId: discount.id,
            discountName: discount.name,
        };
        const imageUrl = discount.image;

        await this.notifyUsers(title, body, data, imageUrl);
    }

    async notifyUsersAboutCombo(combo: any): Promise<void> {
        const title = 'GoDely - ¡New Bundle Available!';
        const body = `Take a look at our new bundle: ${combo.name}`;
        const data = {
            comboId: combo.id,
            comboName: combo.name
        };
        const imageUrl = combo.images[0];

        await this.notifyUsers(title, body, data, imageUrl);
    }

    async notifyUsersAboutOrder(order: any, token: string): Promise<void> {
        const title = 'GoDely - Order Confirmation';
        const body = `Your Order is ready to be served: ${order.status}`;
        const data = {
            orderId: order.id,
            orderAddress: order.address
        };
    
        await this.notifyUsers(title, body, data, token);
    }
    
}
