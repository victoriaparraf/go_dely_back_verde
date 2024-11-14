import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';

@Controller()
export class MailController {
    constructor(private readonly mailerService: MailerService) {}

    @MessagePattern('product_notification')
    async handleProductNotification(
        @Payload() data: { productName: string; productCategory: string; message: string },
        @Ctx() context: RmqContext,
    ) {
        console.log('Received product notification:', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        // Envía el correo electrónico
        await this.mailerService.sendMail({
            to: 'godely7724@gmail.com',
            subject: 'Nuevo Producto Disponible',
            text: data.message,
        });

        // Acknowledge para que el mensaje sea confirmado
        channel.ack(originalMsg);
    }
}