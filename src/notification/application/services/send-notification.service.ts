import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FirebaseNotificationsService } from '../../../common/infraestructure/firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
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
    ): Promise<void> {
        const notifications = await this.notificationRepository.find({
            select: ['token'],
        });

        const tokens = notifications.map(notification => notification.token);

        if (tokens.length === 0) {
            console.log('No hay tokens de notificación registrados.');
            return;
        }

        await this.firebaseNotificationsService.sendNotification(tokens, title, body, data);
    }

    async notifyUsersAboutNewProduct(product: Product): Promise<void> {
        const title = '¡Nuevo producto disponible!';
        const body = `Descubre nuestro nuevo producto: ${product.product_name.getValue()}`;
        const data = {
            productId: product.product_id.toString(),
            productName: product.product_name.getValue(),
        };

        await this.notifyUsers(title, body, data);
    }

    async notifyUsersAboutDiscount(discount: any): Promise<void> {
        const title = '¡Nuevo descuento!';
        const body = `Aprovecha un ${discount.percentage}% de descuento en nuestros productos seleccionados`;
        const data = {
            discountId: discount.id,
            discountName: discount.name,
        };

        await this.notifyUsers(title, body, data);
    }

    async notifyUsersAboutCombo(comboDetails: any): Promise<void> {
        const title = '¡Nuevo combo disponible!';
        const body = `Descubre nuestro nuevo combo: ${comboDetails.name}`;
        const data = {
            comboId: comboDetails.id,
        };

        await this.notifyUsers(title, body, data);
    }
}
