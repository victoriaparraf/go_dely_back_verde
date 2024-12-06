import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './mail.service';

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
            defaults: {
            from: configService.get<string>('EMAIL_FROM'),
            },
        }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class MailModule {}