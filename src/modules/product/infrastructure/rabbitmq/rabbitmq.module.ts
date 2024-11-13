// rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
            name: 'RABBITMQ_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'product_notifications_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class RabbitmqModule {}