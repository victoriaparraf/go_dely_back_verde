import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from '../application/commands/notification.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/infrastructure/typeorm/user-entity';
import { GetUser } from 'src/auth/infrastructure/jwt/strategies/get-user.decorator';
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

    try {
      const savedToken = await this.notificationService.saveToken(user.user_id, saveNotificationDto.token);
      return {
        message: 'Token saved successfully',
        data: savedToken,
      };
    } catch (error) {
      throw new HttpException('Error saving token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
