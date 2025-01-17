import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../infraestructure/typeorm/notification.entity';
import { User } from 'src/user/infrastructure/typeorm/user-entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationTokenRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async saveToken(userId: string, token: string): Promise<Notification> {
    try {
      const user = await this.userRepository.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }

      const existingNotification = await this.notificationTokenRepository.findOne({
        where: {
          user: { user_id: userId },
          token: token,
        },
      });

      if (existingNotification) {
        return existingNotification;
      }
      
      const notification = this.notificationTokenRepository.create({
        user,
        token,
      });
  
      return await this.notificationTokenRepository.save(notification);

    } catch (error) {
      throw new InternalServerErrorException('Error saving token');
    }
  }
}