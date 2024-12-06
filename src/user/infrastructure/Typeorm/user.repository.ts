import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRepositoryInterface } from 'src/user/domain/user-repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { user_id: id } });
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.repository.findOne({ where: { user_id: id } });
    if (user) {
      await this.repository.remove(user);
    }
  }
}