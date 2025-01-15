import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/infrastructure/get-user.decorator';
import { UpdateOrderDto } from 'src/order/infraestructure/dtos/update-order.dto';
import { CreateOrderServiceEntryDto } from 'src/order/application/dto/entry/create-order-entry.dto';
import { ResponseOrderDTO } from '../dtos/response-order.dto';
import { CreateOrderService } from 'src/order/application/command/create-order-service';
import { GetOrderService } from 'src/order/application/query/get-order-service';
import { UpdateOrderService } from 'src/order/application/command/update-order-service';
import { RemoveOrderService } from 'src/order/application/command/delete-order-service';
import { UpdateOrderStatusService } from 'src/order/application/command/update-order-status-service';
import { OrderStatus } from 'src/order/domain/enums/order-status.enum';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(
        private readonly createOrderService: CreateOrderService,
        private readonly getOrderService: GetOrderService,
        private readonly updateOrderService: UpdateOrderService,
        private readonly removeOrderService: RemoveOrderService,
        private readonly updateOrderStatusService: UpdateOrderStatusService,
    ) {}

    @Post('create')
    @UseGuards( AuthGuard('jwt') )
    async create(
        @Body() createOrderDto: CreateOrderServiceEntryDto,
        @GetUser('user_id') user_id: string
        ): Promise<ResponseOrderDTO> {
        return this.createOrderService.createOrder(createOrderDto, user_id);
    }

    @Get('many')
    async findAll(): Promise<ResponseOrderDTO[]> {
        return this.getOrderService.findAll();
    }

    @Get('many/past')
    async getPastOrders(): Promise<ResponseOrderDTO[]> {
        const statuses = [OrderStatus.CANCELLED, OrderStatus.DELIVERED];
        return this.getOrderService.findByStatuses(statuses);
    }

    @Get('many/active')
    async getActiveOrders(): Promise<ResponseOrderDTO[]> {
        const statuses = [OrderStatus.BEING_PROCESSED, OrderStatus.CREATED, OrderStatus.SHIPPED];
        return this.getOrderService.findByStatuses(statuses);
    }

    @Get('one/:id')
    async getOrderById(@Param('id') orderId: string): Promise<ResponseOrderDTO | null> {
        return this.getOrderService.execute(orderId);
    }

    @Patch('update/:id')
    async updateOrder(@Param('id') orderId: string, @Body() updateOrderDto: UpdateOrderDto): Promise<{ message: string }> {
        await this.updateOrderService.execute(orderId, updateOrderDto);
        return { message: 'Order updated successfully.'}
    }

    @Patch('change/state/:id')
    async updateOrderStatus(@Param('id') orderId: string, @Body('status') newStatus: OrderStatus): Promise<{ message: string }> {
        await this.updateOrderStatusService.execute(orderId, newStatus);
        return { message: `Order status updated to: ${newStatus}.` }
    }

    @Delete('delete/:id')
    async removeOrder(@Param('id') orderId: string): Promise<{ message: string }> {
        await this.removeOrderService.execute(orderId);
        return { message: 'Order deleted successfully.'}
    }
}
