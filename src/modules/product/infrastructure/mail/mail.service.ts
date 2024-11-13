// mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    @EventPattern('product_created')
    async handleProductCreated(
        @Payload() data: { productName: string; productCategory: string; message: string },
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        // Aquí envía el correo
        await this.mailerService.sendMail({
            to: 'godely7724@gmail.com', 
            subject: 'Nuevo Producto Disponible',
            text: data.message,
        });

        // Confirma el mensaje para RabbitMQ
        channel.ack(originalMsg);
    }
}
