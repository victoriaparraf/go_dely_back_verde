import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/order/domain/order-aggregate';
import { OrderEntity } from '../typeorm/order-entity';
import { OrderMapper } from '../mappers/order.mapper';
import { User } from 'src/user/infrastructure/typeorm/user.entity';

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repository: Repository<OrderEntity>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>

    ) {}

    async findAll(): Promise<Order[]> {
        const entities = await this.repository.find({ relations: ['user'] });
        return entities.map(OrderMapper.toDomain);
    }

    async findById(orderId: string): Promise<Order | null> {
        const entity = await this.repository.findOne({ where: { order_id: orderId }, relations: ['user'] });
        return entity ? OrderMapper.toDomain(entity) : null;
    }

    async save(order: Order): Promise<void> {
        const user = await this.userRepository.findOne({ where: { user_id: order.getUserId().value } });
    if (!user) {
        throw new Error('User not found');
    }
    
        const orderEntity = this.repository.create({
            ...OrderMapper.toEntity(order),
            user,
        });
    
        await this.repository.save(orderEntity);
    }

    async remove(orderId: string): Promise<void> {
        await this.repository.delete(orderId);
    }
}
