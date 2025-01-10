import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentMethodRepository } from 'src/payment-method/infrastructure/typeorm/payment-method.repository';
import { CreateOrderDto } from '../infraestructure/dtos/create-order.dto';
import { UpdateOrderDto } from '../infraestructure/dtos/update-order.dto';
import { OrderRepository } from '../infraestructure/typeorm/order-repository';
import { Order } from '../domain/order-aggregate';
import { OrderMapper } from '../infraestructure/mappers/order.mapper';
import { ResponseOrderDTO } from '../infraestructure/dtos/response-order.dto';
import { OrderStatus } from '../domain/enums/order-status.enum';
import { ClientProxy } from '@nestjs/microservices';
import { OrderProduct } from '../infraestructure/typeorm/order-product';
import { OrderEntity } from '../infraestructure/typeorm/order-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ComboRepository } from 'src/combo/infrastructure/typeorm/combo-repository';
import { OrderCombo } from '../infraestructure/typeorm/order-combo';
import { Address } from 'src/user/infrastructure/typeorm/address-entity';
import { AddressMapper } from '../../user/infrastructure/mappers/address.mapper';
import { ProductRepository } from 'src/product/infrastructure/repositories/product-repositoy';

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly paymentMethodRepository: PaymentMethodRepository,
        @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
        private readonly productRepository: ProductRepository,
        private readonly comboRepository: ComboRepository,
        @InjectRepository(OrderProduct) private readonly orderProductRepository: Repository<OrderProduct>,
        @InjectRepository(OrderCombo) private readonly orderComboRepository: Repository<OrderCombo>,
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>
    ) {}

    async createOrder(dto: CreateOrderDto, user_id: string): Promise<ResponseOrderDTO> {
        try {
            const paymentMethod = await this.paymentMethodRepository.findById(dto.paymentMethodId);
            if (!paymentMethod) {
                throw new Error(`Payment method with ID ${dto.paymentMethodId} not found`);
            }

            const address= await this.addressRepository.findOne({
                where: {
                  address_id: dto.address_id,
                  user: { user_id: user_id },
                },
                relations: ['user'],
            });
    
            if ((!dto.order_products || dto.order_products.length === 0) && (!dto.order_combos || dto.order_combos.length === 0)) {
                throw new Error('At least one product or combo must be included in the order');
            }
    
            const order = Order.create(address, dto.currency, 0, dto.paymentMethodId, user_id);
    
            let total = 0;
            const orderProducts = [];
            const orderCombos = [];
    
            if (dto.order_products && dto.order_products.length > 0) {
                const products = await Promise.all(dto.order_products.map(p => this.productRepository.findOne(p.product_id)));
                if (products.includes(null)) {
                    throw new Error('Some products not found');
                }
    
                dto.order_products.forEach(productData => {
                    const product = products.find(p => p?.product_id === productData.product_id);
                    if (!product) {
                        throw new Error(`Product with ID ${productData.product_id} not found`);
                    }
    
                    const orderProduct = new OrderProduct();
                    orderProduct.order_id = order.getId().toString();
                    orderProduct.product_id = product.product_id;
                    orderProduct.product = product;
                    orderProduct.quantity = productData.quantity;
                    orderProduct.product_price = productData.product_price;
                    orderProduct.total_price = productData.quantity * productData.product_price;
                    orderProduct.order = null;
    
                    total += orderProduct.total_price;
                    orderProducts.push(orderProduct);
                });
    
                orderProducts.forEach(op => order.addOrderProduct(op));
            }
    
            if (dto.order_combos && dto.order_combos.length > 0) {
                const combos = await Promise.all(dto.order_combos.map(c => this.comboRepository.findComboById(c.combo_id)));
                if (combos.includes(null)) {
                    throw new Error('Some combos not found');
                }
    
                dto.order_combos.forEach(comboData => {
                    const combo = combos.find(c => c?.combo_id === comboData.combo_id);
                    if (!combo) {
                        throw new Error(`Combo with ID ${comboData.combo_id} not found`);
                    }
    
                    const orderCombo = new OrderCombo();
                    orderCombo.order_id = order.getId().toString();
                    orderCombo.combo = combo;
                    orderCombo.combo_id = combo.combo_id;
                    orderCombo.quantity = comboData.quantity;
                    orderCombo.combo_price = comboData.combo_price;
                    orderCombo.total_price = comboData.quantity * comboData.combo_price;
                    orderCombo.order = null;
    
                    total += orderCombo.total_price;
                    orderCombos.push(orderCombo);
                });
    
                orderCombos.forEach(oc => order.addOrderCombo(oc));
            }
    
            console.log("Total before update:", total);
            order.updateTotal(total);
    
            const orderEntity = new OrderEntity();
            orderEntity.order_id = order.getId().getValue();
            orderEntity.address = order.getAddress();
            orderEntity.currency = order.getCurrency().value;
            orderEntity.total = order.getTotal();
            console.log("Total in OrderEntity:", orderEntity.total);
            orderEntity.paymentMethodId = order.getPaymentMethodId().toString();
            orderEntity.status = order.getStatus();
            orderEntity.order_products = orderProducts;
            orderEntity.order_combos = orderCombos;
    
            orderProducts.forEach(op => op.order = orderEntity);
            orderCombos.forEach(oc => oc.order = orderEntity);
    
            console.log("Order to be saved:", order); 
            await this.orderRepository.save(order);
            await this.orderProductRepository.save(orderProducts);
            await this.orderComboRepository.save(orderCombos);
    
            // Enviar la notificación de la orden
            this.client.send('order_notification', {
                orderAddress: AddressMapper.toDtoAddres(address).name,
                orderTotal: total,
                orderCurrency: dto.currency,
                message: 'Your order is ready to be served',
            }).subscribe();
    
            return OrderMapper.toDTO(order);
        } catch (error) {
            throw new InternalServerErrorException(`Failed to create order: ${error}`);
        }
    }
    

    async findAll(): Promise<ResponseOrderDTO[]> {
        const orders = await this.orderRepository.findAll();

        const orderDTOs = await Promise.all(orders.map(order => {
            const orderEntity = new OrderEntity();
            orderEntity.order_id = order.getId().toString();
            orderEntity.address = order.getAddress();
            orderEntity.currency = order.getCurrency().toString();
            orderEntity.total = order.getTotal();
            orderEntity.paymentMethodId = order.getPaymentMethodId().toString();
            orderEntity.status = order.getStatus();
            return OrderMapper.toDTO(order);
        }));
        return orderDTOs;
    }

    async getOrderById(orderId: string): Promise<ResponseOrderDTO | null> {
        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            return null;
        }
        const orderEntity = new OrderEntity();
        orderEntity.order_id = order.getId().toString();
        orderEntity.address = order.getAddress();
        orderEntity.currency = order.getCurrency().toString();
        orderEntity.total = order.getTotal();
        orderEntity.paymentMethodId = order.getPaymentMethodId().toString();
        orderEntity.status = order.getStatus();
        return OrderMapper.toDTO(order);
    }

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
            order.updateAddress(address);
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
