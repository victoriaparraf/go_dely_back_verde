import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailController } from './mail.controller';
import { GetUsersEmailsService } from 'src/user/application/query/get-users-email.service';
import { User } from 'src/user/infrastructure/typeorm/user-entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User]),
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
    controllers: [MailController],
    providers: [GetUsersEmailsService],
})
export class MailModule {}
