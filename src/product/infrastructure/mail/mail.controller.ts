import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';

@Controller()
export class MailController {
    constructor(private readonly mailerService: MailerService) {}

    @MessagePattern('product_notification')
    async handleProductNotification(
        @Payload() data: { 
            productImages: string[]; 
            productName: string; 
            productCategory: string;
            productWeight: string;
            productDescription: string;
            message: string },
        @Ctx() context: RmqContext,
    ) {
        const htmlContent = `
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
                                <img src="${data.productImages[0]}" style="width: 50%; height: auto; padding: 5px; display: block; margin: 0 auto;">
                            </div>  
                            <div class="product-details" style="margin: 20px 0; text-align: center;">
                                <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">${data.productName} ${data.productWeight}</h2>
                                <p style="font-size: 16px; line-height: 1.5;"><strong>Description: </strong>${data.productDescription}</p>
                                <p style="font-size: 16px; line-height: 1.5;"><strong>Category: </strong>${data.productCategory}</p>
                                <p style="font-size: 16px; line-height: 1.5;">${data.message}</p>
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
    
        // Envía el correo electrónico
        await this.mailerService.sendMail({
            to: 'dragoner919@gmail.com',
            subject: '¡New Product Available! - GoDely',
            html: htmlContent,
        });
    }
}