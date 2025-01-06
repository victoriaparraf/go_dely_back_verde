import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';

@Controller()
export class MailController {
    constructor(private readonly mailerService: MailerService) {}

    @EventPattern('notification')
    async handleNotification(
        @Payload() data: { type: string; payload: any },
        @Ctx() context: RmqContext,
    ) {
        console.log('Sending email:', data);

        // Diccionario de estrategias
        const notificationHandlers: Record<string, (payload: any) => Promise<void>> = {
        product: this.sendNotification.bind(this, '¡New Product Available!', this.generateProductEmail),
        discount: this.sendNotification.bind(this, '¡New Discount Alert!', this.generateDiscountEmail),
        combo: this.sendNotification.bind(this, '¡New Combo Offer!', this.generateComboEmail),
        };

        const handler = notificationHandlers[data.type];

        if (handler) {
        await handler(data.payload);
        } else {
        console.warn(`Unknown notification type: ${data.type}`);
        }
    }

    private async sendNotification(
        subjectPrefix: string,
        generateHtml: (payload: any) => string,
        payload: any,
    ) {
        const htmlContent = generateHtml(payload);
        const subject = `${subjectPrefix} - GoDely`;
        await this.mailerService.sendMail({
        to: 'dragoner919@gmail.com',
        subject,
        html: htmlContent,
        });
    }

    private generateProductEmail(payload: any): string {
        return `
        <h1>¡New Product Available!</h1>
        <p><strong>Product Name:</strong> ${payload.productName}</p>
        <p><strong>Category:</strong> ${payload.productCategory}</p>
        <p><strong>Description:</strong> ${payload.productDescription}</p>
        <p><strong>Weight:</strong> ${payload.productWeight}</p>
        <img src="${payload.productImages[0]}" alt="Product Image" style="width: 100%; max-width: 600px;" />
        `;
    }

    private generateDiscountEmail(payload: any): string {
        return `
        <h1>¡New Discount Available!</h1>
        <p><strong>Discount Name:</strong> ${payload.discountName}</p>
        <p><strong>Description:</strong> ${payload.description}</p>
        <p><strong>Discount Percentage:</strong> ${payload.percentage}%</p>
        `;
    }

    private generateComboEmail(payload: any): string {
        return `
        <h1>¡New Combo Offer!</h1>
        <p><strong>Combo Name:</strong> ${payload.comboName}</p>
        <p><strong>Description:</strong> ${payload.description}</p>
        <ul>
            ${payload.products
            .map((product: any) => `<li>${product.name} - ${product.quantity}</li>`)
            .join('')}
        </ul>
        `;
    }
}
