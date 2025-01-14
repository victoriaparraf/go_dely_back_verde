import { Injectable } from '@nestjs/common';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseNotificationsService {
    async sendNotification(
        tokens: string[],
        title: string,
        body: string,
        data?: Record<string, string>,
        imageUrl?: string
    ): Promise<void> {
        if (!tokens || tokens.length === 0) {
            console.warn('No tokens provided for notification');
            return;
        }

        const message: MulticastMessage = {
            tokens,
            notification: {
                title,
                body,
                imageUrl,
            },
            data,
        };

        try {
            const response = await getMessaging().sendEachForMulticast(message);
            console.log(
                `Notificaciones enviadas correctamente: ${response.successCount}, Fallidas: ${response.failureCount}`,
            );
        } catch (error) {
            console.error('Error enviando notificaciones:', error.message);
        }
    }
}

