import { Module } from '@nestjs/common';
import { CloudinaryModule } from './infraestructure/cloudinary/cloudinary.module';
import { RabbitmqModule } from './infraestructure/rabbitmq/rabbitmq.module';
import { MailModule } from './infraestructure/email/mail.module';
import { FirebaseModule } from './infraestructure/firebase/firebase.module';

@Module({
    imports: [ CloudinaryModule, RabbitmqModule, MailModule, FirebaseModule ],
    exports: [ CloudinaryModule, RabbitmqModule, MailModule, FirebaseModule]
})
export class CommonModule {}
