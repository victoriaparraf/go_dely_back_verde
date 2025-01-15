import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from '../infraestructure/dtos/update-order.dto';
import { OrderRepository } from '../infraestructure/typeorm/order-repository';
import { OrderStatus } from '../domain/enums/order-status.enum';
import { ClientProxy } from '@nestjs/microservices';
import { OrderProduct } from '../infraestructure/typeorm/order-product';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCombo } from '../infraestructure/typeorm/order-combo';
import { Address } from 'src/user/infrastructure/typeorm/address-entity';

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        @InjectRepository(OrderProduct) private readonly orderProductRepository: Repository<OrderProduct>,
        @InjectRepository(OrderCombo) private readonly orderComboRepository: Repository<OrderCombo>,
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>
    ) {}

    async updateOrder(orderId: string, dto: UpdateOrderDto): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error(`Order with ID ${orderId} not found`);
        }

        if (dto.currency) {
            order.updateCurrency(dto.currency);
        }

        if (dto.paymentMethodId) {
            order.updatePaymentMethodId(dto.paymentMethodId);
        }

        if (dto.address_id) {
            const address = await this.addressRepository.findOne({ where: { address_id: dto.address_id } }); 
            if (!address) {
                throw new Error(`Address with ID ${dto.address_id} not found`);
            }
            order.updateAddress(address.toString());
        }

        if (dto.total !== undefined) {
            order.updateTotal(dto.total);
        }

        await this.orderRepository.save(order);
    }

    async remove(orderId: string): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
        }
        await this.orderProductRepository.delete({ order_id: orderId });
        await this.orderComboRepository.delete({ order_id: orderId });
        await this.orderRepository.remove(orderId);
    }

    async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        order.setStatus(newStatus);
        await this.orderRepository.save(order);
    }
}
