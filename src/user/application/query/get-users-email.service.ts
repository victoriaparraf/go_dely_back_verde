import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/infrastructure/typeorm/user.repository';

@Injectable()
export class GetUsersEmailsService {
    constructor(
        private readonly userRepository: UserRepository, 
    ) {}

    async getAllUserEmails(): Promise<string[]> {
        const users = await this.userRepository.findAll();
        return users.map(user => user.user_email.getValue());
    }
}