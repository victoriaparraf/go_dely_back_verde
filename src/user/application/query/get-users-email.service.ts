import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/infrastructure/typeorm/user-entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetUsersEmailsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User> 
    ) {}

    async getAllUserEmails(): Promise<string[]> {
        const users = await this.userRepository.find();
        return users.map(user => user.user_email.toString());
    }
}