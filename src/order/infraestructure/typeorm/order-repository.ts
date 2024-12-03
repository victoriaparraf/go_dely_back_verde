import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/order/domain/order-aggregate';
import { OrderEntity } from '../typeorm/order-entity';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repository: Repository<OrderEntity>,
    ) {}

    async findAll(): Promise<Order[]> {
        const entities = await this.repository.find();
        return entities.map(OrderMapper.toDomain);
    }

    async findById(orderId: string): Promise<Order | null> {
        const entity = await this.repository.findOne({ where: { order_id: orderId } });
        return entity ? OrderMapper.toDomain(entity) : null;
    }

    async save(order: Order): Promise<void> {
        const entity = OrderMapper.toEntity(order);
        await this.repository.save(entity);
    }

    async remove(orderId: string): Promise<void> {
        await this.repository.delete(orderId);
    }
}
