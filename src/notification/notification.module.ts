import { Module } from '@nestjs/common';
import { NotificationService } from './application/commands/notification.service';
import { NotificationController } from './infraestructure/notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './infraestructure/typeorm/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
