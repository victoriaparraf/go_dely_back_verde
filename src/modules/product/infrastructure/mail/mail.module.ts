// mail.module.ts
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com', // tu servicio SMTP
        port: 587,
        secure: false,
        auth: {
          user: 'user@example.com', // tu usuario SMTP
          pass: 'password', // tu contraseña SMTP
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
