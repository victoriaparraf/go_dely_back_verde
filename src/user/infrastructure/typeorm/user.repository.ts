import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user-entity';
import { UserRepositoryInterface } from 'src/user/domain/user-repository.interface';
import { Address } from './address-entity';


@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,

    @InjectRepository(Address)
     private readonly addressRepository: Repository<Address>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { user_id: id }, relations: ['addresses'] });
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.repository.findOne({ where: { user_id: id }, relations: ['addresses'] });
    if (user) {
    if (user.addresses && user.addresses.length > 0) {
      await this.addressRepository.remove(user.addresses);
    }
      await this.repository.remove(user);
    }
  }
}