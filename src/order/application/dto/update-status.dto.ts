import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/order/domain/enums/order-status.enum';

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus, { message: 'Invalid order status' })
    status: OrderStatus;
}
