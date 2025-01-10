import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
    constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) {}

    async sendToQueue(queue: string, message: any): Promise<void> {
        this.client.emit(queue, message);
    }
}
