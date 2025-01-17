import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Order } from 'src/order/domain/order-aggregate';
import { OrderEntity } from '../typeorm/order-entity';
import { OrderMapper } from '../mappers/order.mapper';
import { User } from 'src/user/infrastructure/typeorm/user-entity';
import { OrderProduct } from '../typeorm/order-product';
import { OrderCombo } from '../typeorm/order-combo';
import { OrderStatus } from 'src/order/domain/enums/order-status.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,

    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,

    @InjectRepository(OrderCombo)
    private readonly orderComboRepository: Repository<OrderCombo>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(paginationDto?: PaginationDto): Promise<OrderEntity[]> {
    const { page = 1, perpage = 10 } = paginationDto || {};
    return this.repository.find({
      relations: ['user', 'order_products', 'order_combos', 'order_products.product.images'],
      skip: (page - 1) * perpage,
      take: perpage,
    });
  }

  async findByStatuses(statuses: OrderStatus[], paginationDto?: PaginationDto): Promise<OrderEntity[]> {
    const { page = 1, perpage = 10 } = paginationDto || {};
    return this.repository.find({
      where: { status: In(statuses) },
      relations: ['user', 'order_products', 'order_combos'],
      skip: (page - 1) * perpage,
      take: perpage,
    });
  }

  async findById(orderId: string): Promise<Order | null> {
    const entity = await this.repository.findOne({
      where: { order_id: orderId },
      relations: ['user', 'order_products', 'order_combos'],
    });
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findOrdersByDateRange(startDate: Date, endDate: Date): Promise<OrderEntity[]> {
    return this.repository.find({
      where: {
        createdDate: Between(startDate, endDate),
      },
      relations: ['order_products'],
    });
  }

  async findComboOrdersByDateRange(startDate: Date, endDate: Date): Promise<OrderEntity[]> {
    return this.repository.find({
      where: {
        createdDate: Between(startDate, endDate),
      },
      relations: ['order_combos'],
    });
  }

  async save(order: Order): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { user_id: order.getUserId().value },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const orderEntity = this.repository.create({
      ...OrderMapper.toEntity(order),
      user,
    });

    await this.repository.save(orderEntity);
  }

  async saveOrderProducts(orderProducts: OrderProduct[]): Promise<void> {
    await this.orderProductRepository.save(orderProducts);
  }

  async saveOrderCombos(orderCombos: OrderCombo[]): Promise<void> {
    await this.orderComboRepository.save(orderCombos);
  }

  async remove(orderId: string): Promise<void> {
    await this.repository.delete(orderId);
  }

  async findLastOrder(): Promise<OrderEntity | undefined> {
    return this.repository.createQueryBuilder('order')
      .orderBy('order.incremental_id', 'DESC')
      .getOne();
  }
  
}
