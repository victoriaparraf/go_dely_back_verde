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
            message: string },
        @Ctx() context: RmqContext,
    ) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>¡New Product Available!</title>
            <style>
              /* Estilos básicos */
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f7f6;
                margin: 0;
                padding: 0;
                color: #333;
                text-align: center;
              }
              .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              .header {
                background-color: #4CAF50;
                padding-bottom: 20px;
                border-radius: 10px;
                text-align: center;
                height: 50px;
              }
              .header h1 {
                color: #ffffff;
                font-size: 28px;
                top: 50%;
                -ms-transform: translateY(50%);
                transform: translateY(50%);
              }
              .product-details {
                margin: 20px 0;
              }
              .product-details h2 {
                color: #333;
                font-size: 24px;
                margin-bottom: 10px;
              }
              .product-details p {
                font-size: 16px;
                line-height: 1.5;
              }
              .cta-button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 20px;
                background-color: #4CAF50;
                color: #ffffff;
                text-decoration: none;
                font-size: 16px;
                border-radius: 5px;
                text-align: center;
                transition: background-color 0.3s;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>¡New Product Available! GoDely</h1>
              </div>
              <div class="product-details">
                  <img src="${data.productImages[0]}">
              </div>  
              <div class="product-details">
                <h2>${data.productName}</h2>
                <p><strong>Category:</strong> ${data.productCategory}</p>
                <p>${data.message}</p>
              </div>
              <p class="cta-button">✨Check it out on GoDely App ✨</p>
              <div class="footer">
                <p>If you have any problems, please contact us at support@godely.com</p>
                <p>© 2024 Godely | All rights reserved</p>
              </div>
            </div>
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