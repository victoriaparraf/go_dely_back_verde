import { Module } from '@nestjs/common';
import { CloudinaryModule } from './infraestructure/cloudinary/cloudinary.module';
import { RabbitmqModule } from './infraestructure/rabbitmq/rabbitmq.module';
import { MailModule } from 'src/product/infrastructure/mail/mail.module';

@Module({
    imports: [ CloudinaryModule, RabbitmqModule, MailModule ],
    exports: [ CloudinaryModule, RabbitmqModule, MailModule ]
})
export class CommonModule {}
