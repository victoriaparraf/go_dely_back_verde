import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { GetUsersEmailsService } from 'src/user/application/query/get-users-email.service';

@Controller()
export class MailController {
    constructor(
        private readonly mailerService: MailerService,
        private readonly getUsersEmailService: GetUsersEmailsService,
    ) {}

    @EventPattern('notification')
    async handleNotification(
        @Payload() data: { type: string; payload: any; email?: string },
        @Ctx() context: RmqContext,
    ) {
        console.log('Sending email:', data);

        // Diccionario de estrategias
        const notificationHandlers: Record<string, (payload: any) => Promise<void>> = {
        product: this.sendNotification.bind(this, '¡New Product Available!', this.generateProductEmail),
        discount: this.sendNotification.bind(this, '¡New Discount Alert!', this.generateDiscountEmail),
        combo: this.sendNotification.bind(this, '¡New Combo Offer!', this.generateComboEmail),
        order: this.sendNotification.bind(this, 'Order Confirmation', this.generateOrderEmail),
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
        email?: string,
    ) {
        const htmlContent = generateHtml(payload);
        const subject = `${subjectPrefix} - GoDely`;

        if (email) {
            await this.mailerService.sendMail({
                to: email,
                subject,
                html: htmlContent,
            });
            console.log('sending just 1');
        } else {
            const userEmails = await this.getUsersEmailService.getAllUserEmails();
            for (const userEmail of userEmails) {
                await this.mailerService.sendMail({
                    to: userEmail,
                    subject,
                    html: htmlContent,
                });
            }
            console.log('sending many');
        }
    }

    private generateProductEmail(payload: any): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Responsive Email Template</title>
        </head>

        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; color: #333; text-align: center;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6;">
                <tr>
                    <td align="center" style="padding: 20px;">
                        <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; max-width: 600px; width: 100%;">
                            <!-- Header -->
                            <tr>
                                <td class="header" style="background-color: #4CAF50; padding: 40px; text-align: center; color: white; font-size: 24px; border-radius: 50px;">
                                    ¡New Product Available!
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                    <div class="product-details" style="text-align: center; margin: 20px 0;">
                                        <img src="${payload.images[0]}" style="width: 50%; height: auto; padding: 5px; display: block; margin: 0 auto;">
                                    </div>  
                                    <div class="product-details" style="margin: 20px 0; text-align: center;">
                                        <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;"><strong>Product Name:</strong> ${payload.name}</h2>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Description: </strong>${payload.description}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Category: </strong>${payload.categories}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Weight:</strong> ${payload.weight}</p>
                                    </div>
                                    <div class="center" style="width: 100%; display: block; margin: 20px auto; text-align: center;">
                                        <p class="cta-button" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px; text-align: center;">
                                            ✨ Check it out on GoDely App ✨
                                        </p>   
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td class="footer" style="background-color: #828282; padding: 40px; text-align: center; color: white; font-size: 14px; border-radius: 50px;">
                                    <img class="image" src="https://res.cloudinary.com/ddcvgljzq/image/upload/v1731612049/logo/d9e8qa7zivilrwyr0l75.png" style="width: 50%; height: auto; padding: 5px; display: block; margin: 0 auto;">
                                    <p>If you have any problems, please contact us at support@godely.com</p>
                                    <p>© 2024 GoDely | All rights reserved</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;
    }

    private generateDiscountEmail(payload: any): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Responsive Email Template</title>
        </head>

        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; color: #333; text-align: center;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6;">
                <tr>
                    <td align="center" style="padding: 20px;">
                        <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; max-width: 600px; width: 100%;">
                            <!-- Header -->
                            <tr>
                                <td class="header" style="background-color: #4CAF50; padding: 40px; text-align: center; color: white; font-size: 24px; border-radius: 50px;">
                                    ¡New Offer!
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                    <div class="product-details" style="text-align: center; margin: 20px 0;">
                                        <img src="${payload.image}" style="width: 50%; height: auto; padding: 5px; display: block; margin: 0 auto;">
                                    </div>  
                                    <div class="product-details" style="margin: 20px 0; text-align: center;">
                                        <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;"><strong>Discount Name:</strong> ${payload.name}</h2>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Description: </strong>${payload.description}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Percentage: </strong>${payload.percentage}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Available until:</strong> ${payload.expireDate}</p>
                                    </div>
                                    <div class="center" style="width: 100%; display: block; margin: 20px auto; text-align: center;">
                                        <p class="cta-button" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px; text-align: center;">
                                            ✨ Check it out on GoDely App ✨
                                        </p>   
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td class="footer" style="background-color: #828282; padding: 40px; text-align: center; color: white; font-size: 14px; border-radius: 50px;">
                                    <img class="image" src="https://res.cloudinary.com/ddcvgljzq/image/upload/v1731612049/logo/d9e8qa7zivilrwyr0l75.png" style="width: 50%; height: auto; padding: 5px; display: block; margin: 0 auto;">
                                    <p>If you have any problems, please contact us at support@godely.com</p>
                                    <p>© 2024 GoDely | All rights reserved</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;
    }

    private generateComboEmail(payload: any): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Responsive Email Template</title>
        </head>

        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; color: #333; text-align: center;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6;">
                <tr>
                    <td align="center" style="padding: 20px;">
                        <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; max-width: 600px; width: 100%;">
                            <!-- Header -->
                            <tr>
                                <td class="header" style="background-color: #4CAF50; padding: 40px; text-align: center; color: white; font-size: 24px; border-radius: 50px;">
                                    ¡New Combo Available!
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                    <div class="product-details" style="text-align: center; margin: 20px 0;">
                                        <img src="${payload.images[0]}" style="width: 50%; height: auto; padding: 5px; display: block; margin: 0 auto;">
                                    </div>  
                                    <div class="product-details" style="margin: 20px 0; text-align: center;">
                                        <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;"><strong>Combo Name:</strong> ${payload.name}</h2>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Description: </strong>${payload.description}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Weight:</strong> ${payload.weight} ${payload.measurement}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Available until: </strong> ${payload.caducityDate}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Products included:</strong></p>
                                    </div>
                                    <div class="center" style="width: 100%; display: block; margin: 20px auto; text-align: center;">
                                        <p class="cta-button" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px; text-align: center;">
                                            ✨ Check it out on GoDely App ✨
                                        </p>   
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td class="footer" style="background-color: #828282; padding: 40px; text-align: center; color: white; font-size: 14px; border-radius: 50px;">
                                    <img class="image" src="https://res.cloudinary.com/ddcvgljzq/image/upload/v1731612049/logo/d9e8qa7zivilrwyr0l75.png" style="width: 50%; height: auto; padding: 5px; display: block; margin: 0 auto;">
                                    <p>If you have any problems, please contact us at support@godely.com</p>
                                    <p>© 2024 GoDely | All rights reserved</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;
    }

    private generateOrderEmail(payload: any): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Responsive Email Template</title>
        </head>

        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; color: #333; text-align: center;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6;">
                <tr>
                    <td align="center" style="padding: 20px;">
                        <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; max-width: 600px; width: 100%;">
                            <!-- Header -->
                            <tr>
                                <td class="header" style="background-color: #4CAF50; padding: 40px; text-align: center; color: white; font-size: 24px; border-radius: 50px;">
                                    Order Confirmation
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                    <div class="product-details" style="margin: 20px 0; text-align: center;">
                                        <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;"><strong>Thank you for placing the order!</strong></h2>
                                        <p style="font-size: 18px; line-height: 2;">Here are the confirmation details</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Order Address: </strong>${payload.address}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Order Total: </strong>${payload.total} ${payload.currency}</p>
                                        <p style="font-size: 16px; line-height: 1.5;"><strong>Payment Method:</strong> ${payload.paymentMethod}</p>
                                        <p style="font-size: 18px; line-height: 2;">Your Order is ready to be served</p>
                                    </div>
                                    <div class="center" style="width: 100%; display: block; margin: 20px auto; text-align: center;">
                                        <p class="cta-button" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px; text-align: center;">
                                            ✨ Check it out on GoDely App ✨
                                        </p>   
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td class="footer" style="background-color: #828282; padding: 40px; text-align: center; color: white; font-size: 14px; border-radius: 50px;">
                                    <img class="image" src="https://res.cloudinary.com/ddcvgljzq/image/upload/v1731612049/logo/d9e8qa7zivilrwyr0l75.png" style="width: 50%; height: auto; padding: 5px; display: block; margin: 0 auto;">
                                    <p>If you have any problems, please contact us at support@godely.com</p>
                                    <p>© 2024 GoDely | All rights reserved</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;
    }
}
