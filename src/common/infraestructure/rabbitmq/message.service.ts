// messaging.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendMessage } from 'src/common/domain/sendMessage';


@Injectable()
export class MessagingService<T> implements SendMessage<T> {
    constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) {}

    async sendMessage(pattern: string, data: T) {
        console.log(`Sending message with pattern: ${pattern}`);
        return this.client.emit(pattern, data);
    }
}
