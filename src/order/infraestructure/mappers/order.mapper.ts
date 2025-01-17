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
        createdDate: order.getCreatedDate(),
        address: order.getAddress(),
        currency: order.getCurrency().value,
        longitude: order.getLongitude(),
        latitude: order.getLatitude(),
        total: order.getTotal(),
        paymentMethod: order.getPaymentMethodName().value,
        status: order.getStatus(),
        cupon_code: order.getCupon()?.value,
        order_products: order.getOrderProducts().map(product => {
          if (!product.product) {
              throw new Error(`Product with ID ${product.product_id} not found`);
          }
          return {
              order_id: product.order_id,
              product_id: product.product_id,
              quantity: product.quantity,
              product_price: product.product_price,
              total_price: product.total_price,
              name: product.product.product_name.getValue(),
              description: product.product.product_description.getValue(),
              currency: product.product.product_currency.getValue(),
              stock: product.product.product_stock.getValue(),
              weight: product.product.product_weight.getValue()
          };
      }),
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
                name: combo.combo.combo_name.getValue(),
                description: combo.combo.combo_description.getValue(),
                currency: combo.combo.combo_currency.getValue(),
                stock: combo.combo.combo_stock.getValue(),
                weight: combo.combo.combo_weight.getValue()
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
        createdDate: order.getCreatedDate(),
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
            quantity: product.quantity,
            id: product.product_id,
            price: product.product.product_price.getValue(),
            total_price: product.total_price,
            name: product.product.product_name.getValue(),
            description: product.product.product_description.getValue(),
            currency: product.product.product_currency.getValue(),
            weight: product.product.product_weight.getValue(),
            measurement: product.product.product_measurement.getValue(),
            stock: product.product.product_stock.getValue(),
            images: product.product.images ? product.product.images.map(image => image.image_url) : [],
        })),
        combos: order.getOrderCombos().map(combo => ({
            quantity: combo.quantity,
            id: combo.combo_id,
            price: combo.combo.combo_price.getValue(),
            total_price: combo.total_price,
            name: combo.combo.combo_name.getValue(),
            description: combo.combo.combo_description.getValue(),
            currency: combo.combo.combo_currency.getValue(),
            stock: combo.combo.combo_stock.getValue(),
            weight: combo.combo.combo_weight.getValue()
        })),
    };
  }
  
}
