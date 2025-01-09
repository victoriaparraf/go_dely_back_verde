import { Module } from '@nestjs/common';
import { NotificationService } from './application/commands/notification.service';
import { NotificationController } from './infraestructure/notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './infraestructure/typeorm/notification.entity';
import { UserModule } from 'src/user/user.module';
import { SendNotificationService } from './application/services/send-notification.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UserModule],
  controllers: [NotificationController],
  providers: [NotificationService, SendNotificationService],
  exports: [NotificationService, SendNotificationService],
})
export class NotificationModule {}
