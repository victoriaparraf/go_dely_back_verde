import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationService } from '../application/commands/notification.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/infrastructure/typeorm/user-entity';
import { GetUser } from 'src/auth/infrastructure/get-user.decorator';
import { SaveNotificationDto } from './dto/save-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('savetoken')
  @UseGuards(AuthGuard('jwt'))
  async saveToken(
    @GetUser() user: User,
    @Body() saveNotificationDto: SaveNotificationDto,
  ) {

    const savedToken = await this.notificationService.saveToken(user.user_id, saveNotificationDto.notification_token);
    return {
      message: 'Token saved successfully',
      data: savedToken,
    };
  }
}
