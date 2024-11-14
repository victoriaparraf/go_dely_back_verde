import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailController } from './mail.controller';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        template: {
          dir: __dirname + './template/notification',
          adapter: new PugAdapter({  inlineCssEnabled: true,}),
          options: {
            strict: true,
          },
        },
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
      }),
    }),
  ],
  controllers: [MailController]
})
export class MailModule {}
