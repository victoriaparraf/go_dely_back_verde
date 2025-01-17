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
import { CouponRepository } from 'src/coupon/infrastructure/repositories/coupon-repository';
import { SendNotificationService } from 'src/notification/application/services/send-notification.service';
import { UserRepository } from 'src/user/infrastructure/typeorm/user.repository';

@Injectable()
export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly sendNotificationService: SendNotificationService,
    private readonly productRepository: ProductRepository,
    private readonly comboRepository: ComboRepository,
    private readonly couponRepository: CouponRepository,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    private readonly userRepository: UserRepository
  ) {}

  async createOrder(dto: CreateOrderServiceEntryDto, userId: string): Promise<ResponseOrderDTO> {
    try {
      // Validar método de pago
      const paymentMethod = await this.paymentMethodRepository.findByName(dto.paymentMethod);
      if (!paymentMethod) throw new Error(`Payment method '${dto.paymentMethod}' not found`);

      // Validar productos y combos
      if ((!dto.products || dto.products.length === 0) && (!dto.combos || dto.combos.length === 0)) {
        throw new Error('At least one product or combo must be included in the order');
      }

      // Obtener el incremental_id
      const lastOrder = await this.orderRepository.findLastOrder();
      const incremental_id = lastOrder ? lastOrder.incremental_id + 1 : 1;

      // Crear la orden
      const order = Order.create(Number(incremental_id), dto.address, dto.longitude, dto.latitude, dto.currency, 0, dto.paymentMethod, userId);

      // Procesar productos y combos
      let total = 0;
      const orderProducts = await this.processOrderProducts(dto.products || [], order);
      const orderCombos = await this.processOrderCombos(dto.combos || [], order);

      // Actualizar el total en la orden
      total = orderProducts.reduce((acc, op) => acc + op.total_price, 0) +
              orderCombos.reduce((acc, oc) => acc + oc.total_price, 0);

      // Aplicar descuento si hay un cupon_code
      console.log(dto.cupon_code);
      if (dto.cupon_code) {
        const coupon = await this.couponRepository.findOneCoupon(dto.cupon_code);
        if (coupon) {
          const discount = (total * Number(coupon.coupon_amount.getValue())) / 100;
          total -= discount;
          order.addCoupon(dto.cupon_code);
        }
      }

      order.updateTotal(total);

      // Guardar la orden y sus detalles
      await this.orderRepository.save(order);
      if (orderProducts.length) await this.orderRepository.saveOrderProducts(orderProducts);
      if (orderCombos.length) await this.orderRepository.saveOrderCombos(orderCombos);

      console.log(order);

      const user = await this.userRepository.findById(userId); 
      if (!user) throw new Error('User not found');
  
      console.log('user email', user.user_email)
      this.client.emit('notification', {
              type: 'order',
              payload: OrderMapper.toDTO(order),
              email: user.user_email
      });

      await this.sendNotificationService.notifyUsersAboutOrder(OrderMapper.toDTO(order), user.user_id);
      return OrderMapper.toDTO(order);

    } catch (error) {
      throw new InternalServerErrorException(`Failed to create order: ${error.message}`);
    }
  }

  private async processOrderProducts(
    productsDto: ProductEntryDto[],
    order: Order,
  ): Promise<OrderProduct[]> {
    console.log('Product IDs:', productsDto.map(p => p.id));

    const products = await Promise.all(productsDto.map(p => this.productRepository.findOne(p.id)));

    console.log('Products found:', products);

    if (products.includes(undefined)) throw new Error('Some products not found');

    return productsDto.map(productData => {
      const product = products.find(p => p?.product_id === productData.id);
      if (!product) throw new Error(`Product with ID ${productData.id} not found`);

      const orderProduct = new OrderProduct();
      orderProduct.order_id = order.getId().toString();
      orderProduct.product_id = product.product_id;
      orderProduct.product = product;
      orderProduct.quantity = productData.quantity;
      orderProduct.product_price = product.product_price.getValue();
      orderProduct.total_price = productData.quantity * product.product_price.getValue();

      order.addOrderProduct(orderProduct);

      return orderProduct;
    });
  }

  private async processOrderCombos(
    combosDto: ComboEntryDto[],
    order: Order,
  ): Promise<OrderCombo[]> {
    const combos = await Promise.all(combosDto.map(c => this.comboRepository.findOne(c.id)));

    if (combos.includes(undefined)) throw new Error('Some combos not found');

    return combosDto.map(comboData => {
      const combo = combos.find(c => c?.combo_id === comboData.id);
      if (!combo) throw new Error(`Combo with ID ${comboData.id} not found`);

      const orderCombo = new OrderCombo();
      orderCombo.order_id = order.getId().toString();
      orderCombo.combo_id = combo.combo_id;
      orderCombo.combo = combo;
      orderCombo.quantity = comboData.quantity;
      orderCombo.combo_price = combo.combo_price.getValue();
      orderCombo.total_price = comboData.quantity * combo.combo_price.getValue();

      order.addOrderCombo(orderCombo);

      return orderCombo;
    });
  }
}
