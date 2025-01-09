import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitmqService } from './rabbitmq.service';
import { MailController } from '../email/mail.controller';
import { MailModule } from '../email/mail.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ClientsModule.registerAsync([
        {
            name: 'RABBITMQ_SERVICE',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: Transport.RMQ,
                options: {
                    urls: [configService.get<string>('RABBITMQ_URL')],
                    queue: configService.get<string>('RABBITMQ_QUEUE'),
                    queueOptions: {
                        durable: true,
                    },
                },
            }),
        },
        ]), 
        
        MailModule
    ],
    controllers: [ MailController ],
    exports: [ ClientsModule, RabbitmqService ],
    providers: [ RabbitmqService ]
})
export class RabbitmqModule {}