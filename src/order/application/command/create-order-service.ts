import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentMethodRepository } from 'src/payment-method/infrastructure/typeorm/payment-method.repository';
import { Address } from 'src/user/infrastructure/typeorm/address-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { ProductRepository } from 'src/product/infrastructure/repositories/product-repositoy';
import { ComboEntryDto, CreateOrderServiceEntryDto, ProductEntryDto } from '../dto/entry/create-order-entry.dto';
import { OrderCombo } from 'src/order/infraestructure/typeorm/order-combo';
import { OrderProduct } from 'src/order/infraestructure/typeorm/order-product';
import { Order } from 'src/order/domain/order-aggregate';
import { ResponseOrderDTO } from 'src/order/infraestructure/dtos/response-order.dto';
import { OrderMapper } from 'src/order/infraestructure/mappers/order.mapper';
import { OrderRepository } from 'src/order/infraestructure/typeorm/order-repository';
import { ComboRepository } from 'src/combo/infrastructure/repositories/combo-repository';

@Injectable()
export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly productRepository: ProductRepository,
    private readonly comboRepository: ComboRepository,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
  ) {}

  async createOrder(dto: CreateOrderServiceEntryDto, userId: string): Promise<ResponseOrderDTO> {
    try {
      // Validar método de pago
      const paymentMethod = await this.paymentMethodRepository.findById(dto.idPayment);
      if (!paymentMethod) throw new Error(`Payment method with ID ${dto.idPayment} not found`);

      // Validar dirección
      const address = await this.addressRepository.findOne({
        where: { address_id: dto.address_id, user: { user_id: userId } },
        relations: ['user'],
      });
      if (!address) throw new Error(`Address with ID ${dto.address_id} not found`);

      // Validar productos y combos
      if ((!dto.products || dto.products.length === 0) && (!dto.combos || dto.combos.length === 0)) {
        throw new Error('At least one product or combo must be included in the order');
      }

      // Crear la orden
      const order = Order.create(address, 'USD', 0, dto.idPayment, userId);

      // Procesar productos y combos
      let total = 0;
      const orderProducts = await this.processOrderProducts(dto.products || [], order);
      const orderCombos = await this.processOrderCombos(dto.combos || [], order);

      // Actualizar el total en la orden
      total = orderProducts.reduce((acc, op) => acc + op.total_price, 0) +
              orderCombos.reduce((acc, oc) => acc + oc.total_price, 0);

      order.updateTotal(total);

      // Guardar la orden y sus detalles
      await this.orderRepository.save(order);
      if (orderProducts.length) await this.orderRepository.saveOrderProducts(orderProducts);
      if (orderCombos.length) await this.orderRepository.saveOrderCombos(orderCombos);

      // Enviar notificación
      this.client.send('order_notification', {
        orderAddress: address.address_id,
        orderTotal: total,
        message: 'Your order is ready to be served',
      }).subscribe();

      return OrderMapper.toDTO(order);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create order: ${error.message}`);
    }
  }

  private async processOrderProducts(
    productsDto: ProductEntryDto[],
    order: Order,
  ): Promise<OrderProduct[]> {
    const products = await Promise.all(productsDto.map(p => this.productRepository.findOne(p.product_id)));

    if (products.includes(null)) throw new Error('Some products not found');

    return productsDto.map(productData => {
      const product = products.find(p => p?.product_id === productData.product_id);
      if (!product) throw new Error(`Product with ID ${productData.product_id} not found`);

      const orderProduct = new OrderProduct();
      orderProduct.order_id = order.getId().toString();
      orderProduct.product_id = product.product_id;
      orderProduct.product = product;
      orderProduct.quantity = productData.quantity;
      orderProduct.product_price = productData.product_price;
      orderProduct.total_price = productData.quantity * productData.product_price;

      order.addOrderProduct(orderProduct);

      return orderProduct;
    });
  }

  private async processOrderCombos(
    combosDto: ComboEntryDto[],
    order: Order,
  ): Promise<OrderCombo[]> {
    const combos = await Promise.all(combosDto.map(c => this.comboRepository.findOne(c.combo_id)));

    if (combos.includes(null)) throw new Error('Some combos not found');

    return combosDto.map(comboData => {
      const combo = combos.find(c => c?.combo_id === comboData.combo_id);
      if (!combo) throw new Error(`Combo with ID ${comboData.combo_id} not found`);

      const orderCombo = new OrderCombo();
      orderCombo.order_id = order.getId().toString();
      orderCombo.combo_id = combo.combo_id;
      orderCombo.combo = combo;
      orderCombo.quantity = comboData.quantity;
      orderCombo.combo_price = comboData.combo_price;
      orderCombo.total_price = comboData.quantity * comboData.combo_price;

      order.addOrderCombo(orderCombo);

      return orderCombo;
    });
  }
}
