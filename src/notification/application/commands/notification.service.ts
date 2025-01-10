import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../infraestructure/typeorm/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationTokenRepository: Repository<Notification>,
  ) {}

  async saveToken(userId: string, token: string): Promise<Notification> {
    try {
      const notificationToken = this.notificationTokenRepository.create({ userId, token });
      return await this.notificationTokenRepository.save(notificationToken);
    } catch (error) {
      throw new InternalServerErrorException('Error saving token');
    }
  }
}