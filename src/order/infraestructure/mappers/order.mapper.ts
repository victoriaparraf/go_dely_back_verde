import { Order } from "src/order/domain/order-aggregate";
import { OrderEntity } from "../typeorm/order-entity";
import { DeepPartial } from "typeorm";
import { ResponseOrderDTO } from "src/order/application/dto/response-order.dto";
import { Product } from "src/product/infrastructure/typeorm/product-entity";

export class OrderMapper {
  static toEntity(order: Order): DeepPartial<OrderEntity> {
    return {
        order_id: order.getId().value,
        address: order.getAddress().value,
        currency: order.getCurrency().value,
        total: order.getTotal(),
        paymentMethodId: order.getPaymentMethodId().value,
        status: order.getStatus()
    };
  }

  static toDomain(entity: OrderEntity): Order {
    return Order.reconstitute(
      entity.order_id,
      entity.address,
      entity.currency,
      entity.total,
      entity.paymentMethodId,
      entity.user.user_id,
      entity.status,
      entity.order_products,
      entity.order_combos,
    );
  }

  static toDTO(order: Order): ResponseOrderDTO {
    return {
        order_id: order.getId().value,
        address: order.getAddress().value,
        currency: order.getCurrency().value,
        total: order.getTotal(),
        paymentMethodId: order.getPaymentMethodId().value,
        user_id: order.getUserId().value,
        status: order.getStatus(),
        order_products: order.getOrderProducts().map(product => ({
            order_id: product.order_id,
            product_id: product.product_id,
            quantity: product.quantity,
            product_price: product.product_price,
            total_price: product.total_price,
            product_name: product.product.product_name.getValue(),
            product_description: product.product.product_description.getValue(),
            product_currency: product.product.product_currency.getValue(),
            product_weight: product.product.product_weight.getValue(),
            product_measurement: product.product.product_measurement.getValue(),
            product_stock: product.product.product_stock.getValue()
        })),
        order_combos: order.getOrderCombos().map(combo => ({
            order_id: combo.order_id,
            combo_id: combo.combo_id,
            quantity: combo.quantity,
            combo_price: combo.combo_price,
            total_price: combo.total_price,
            combo_name: combo.combo.combo_name.getValue(),
            combo_description: combo.combo.combo_description.getValue(),
            combo_currency: combo.combo.combo_currency.getValue(),
            combo_stock: combo.combo.combo_stock.getValue()
        }))
    };
  }
  
}
