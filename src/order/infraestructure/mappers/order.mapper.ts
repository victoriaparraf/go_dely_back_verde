import { Order } from "src/order/domain/order-aggregate";
import { OrderEntity } from "../typeorm/order-entity";
import { DeepPartial } from "typeorm";
import { ResponseOrderDTO } from "src/order/infraestructure/dtos/response-order.dto";
import { CouponCode } from "src/coupon/domain/value-objects/coupon-code.vo";

export class OrderMapper {
  static toEntity(order: Order): DeepPartial<OrderEntity> {
    return {
        order_id: order.getId().value,
        incremental_id: order.getIncrementalId(),
        address: order.getAddress(),
        currency: order.getCurrency().value,
        longitude: order.getLongitude(),
        latitude: order.getLatitude(),
        total: order.getTotal(),
        paymentMethod: order.getPaymentMethodName().value,
        status: order.getStatus(),
        cupon_code: order.getCupon()?.value,
        order_products: order.getOrderProducts().map(product => ({
            order_id: product.order_id,
            product_id: product.product_id,
            quantity: product.quantity,
            product_price: product.product_price,
            total_price: product.total_price,
            product: product.product
        })),
        order_combos: order.getOrderCombos().map(combo => {
            if (!combo.combo) {
                throw new Error(`Combo with ID ${combo.combo_id} not found`);
            }
            return {
                order_id: combo.order_id,
                combo_id: combo.combo_id,
                quantity: combo.quantity,
                combo_price: combo.combo_price,
                total_price: combo.total_price,
                combo_name: combo.combo.combo_name.getValue(),
                combo_description: combo.combo.combo_description.getValue(),
                combo_currency: combo.combo.combo_currency.getValue(),
                combo_stock: combo.combo.combo_stock.getValue(),
                combo_weight: combo.combo.combo_weight.getValue()
            };
        }),
    };
  }

  static toDomain(entity: OrderEntity): Order {
    return Order.reconstitute(
      entity.incremental_id,
      entity.order_id,
      entity.address,
      entity.longitude,
      entity.latitude,
      entity.currency,
      entity.total,
      entity.paymentMethod,
      entity.user.user_id,
      entity.status,
      entity.order_products,
      entity.order_combos,
      entity.cupon_code ? new CouponCode(entity.cupon_code) : undefined,
    );
  }

  static toDTO(order: Order): ResponseOrderDTO {
    return {
        id: order.getId().value,
        incremental_id: order.getIncrementalId(),
        address: order.getAddress(),
        longitude: order.getLongitude(),
        latitude: order.getLatitude(),
        currency: order.getCurrency().value,
        total: order.getTotal(),
        paymentMethod: order.getPaymentMethodName().value,
        user_id: order.getUserId().value,
        status: order.getStatus(),
        cupon_code: order.getCupon()?.value,
        products: order.getOrderProducts().map(product => ({
            id: product.order_id,
            quantity: product.quantity,
            product_id: product.product_id,
            product_price: product.product.product_price.getValue(),
            total_price: product.total_price,
            product_name: product.product.product_name.getValue(),
            product_description: product.product.product_description.getValue(),
            product_currency: product.product.product_currency.getValue(),
            product_weight: product.product.product_weight.getValue(),
            product_measurement: product.product.product_measurement.getValue(),
            product_stock: product.product.product_stock.getValue()
        })),
        combos: order.getOrderCombos().map(combo => ({
            id: combo.order_id,
            quantity: combo.quantity,
            combo_id: combo.combo_id,
            combo_price: combo.combo.combo_price.getValue(),
            total_price: combo.total_price,
            combo_name: combo.combo.combo_name.getValue(),
            combo_description: combo.combo.combo_description.getValue(),
            combo_currency: combo.combo.combo_currency.getValue(),
            combo_stock: combo.combo.combo_stock.getValue(),
            combo_weight: combo.combo.combo_weight.getValue()
        })),
    };
  }
  
}
