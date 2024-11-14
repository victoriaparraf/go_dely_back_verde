import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    ],
    exports: [ClientsModule],
})
export class RabbitmqModule {}