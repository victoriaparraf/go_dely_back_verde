import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MessagingService } from './message.service';
import { RabbitMQConsumerService } from './consumer.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ClientsModule.registerAsync([
        {
            name: 'RABBITMQ_SERVICE',
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
            inject: [ConfigService],
        },
        ]),
    ],
    exports: [ClientsModule, MessagingService],
    providers: [MessagingService],
    controllers: [RabbitMQConsumerService],
})
export class RabbitmqModule {}
