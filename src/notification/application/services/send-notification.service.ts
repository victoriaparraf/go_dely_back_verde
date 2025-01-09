import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FirebaseNotificationsService } from '../../../common/infraestructure/firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/infrastructure/typeorm/user-entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

@Injectable()
export class SendNotificationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly firebaseNotificationsService: FirebaseNotificationsService,
    ) {}

    private async notifyUsers(
        title: string,
        body: string,
        data?: Record<string, string>,
    ): Promise<void> {
        const users = await this.userRepository.find({
        select: ['notification_tokens'],
        });

        const tokens = users
        .flatMap(user => user.notification_tokens)
        .filter(token => !!token);

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

    async notifyUsersAboutDiscount(discountDetails: any): Promise<void> {
        const title = '¡Nuevo descuento!';
        const body = `Aprovecha un ${discountDetails.percentage}% de descuento en ${discountDetails.productName}`;
        const data = {
        discountId: discountDetails.id,
        productName: discountDetails.productName,
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
