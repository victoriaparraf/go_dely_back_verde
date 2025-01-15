import { Injectable, NotFoundException } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { OrderRepository } from '../../infraestructure/typeorm/order-repository';
import { ResponseOrderDTO } from '../../infraestructure/dtos/response-order.dto';
import { OrderMapper } from '../../infraestructure/mappers/order.mapper';
import { OrderStatus } from 'src/order/domain/enums/order-status.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class GetOrderService implements IApplicationService<string, ResponseOrderDTO> {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string): Promise<ResponseOrderDTO> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return OrderMapper.toDTO(order);
  }

  async findAll(paginationDto?: PaginationDto): Promise<ResponseOrderDTO[]> {
    const orders = await this.orderRepository.findAll(paginationDto);
    return orders.map(orderEntity => OrderMapper.toDTO(OrderMapper.toDomain(orderEntity)));
  }

  async findByStatuses(statuses: OrderStatus[], paginationDto?: PaginationDto): Promise<ResponseOrderDTO[]> {
    const orders = await this.orderRepository.findByStatuses(statuses, paginationDto);
    return orders.map(orderEntity => OrderMapper.toDTO(OrderMapper.toDomain(orderEntity)));
  }
}