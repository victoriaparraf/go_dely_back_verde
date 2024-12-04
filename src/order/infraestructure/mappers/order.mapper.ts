import { Order } from "src/order/domain/order-aggregate";
import { OrderEntity } from "../typeorm/order-entity";
import { DeepPartial } from "typeorm";
import { ResponseOrderDTO } from "src/order/application/dto/response-order.dto";

export class OrderMapper {
  static toEntity(order: Order): DeepPartial<OrderEntity> {
    return {
        order_id: order.getId().value,
        address: order.getAddress().value,
        currency: order.getCurrency().value,
        total: order.getTotal().value,
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
      entity.status
    );
  }

  static toDTO(order: Order): ResponseOrderDTO {
    return {
        order_id: order.getId().value,
        address: order.getAddress().value,
        currency: order.getCurrency().value,
        total: order.getTotal().getValue(),
        paymentMethodId: order.getPaymentMethodId().value,
        user_id: order.getUserId().value,
        status: order.getStatus(),
    };
  }
}
