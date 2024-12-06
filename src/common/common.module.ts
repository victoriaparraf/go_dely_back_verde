import { Module } from '@nestjs/common';
import { RabbitmqModule } from './infraestructure/rabbitmq/rabbitmq.module';
import { MailModule } from './infraestructure/mail/mail.module';

@Module({
    imports: [RabbitmqModule, MailModule],
})
export class CommonModule {}
