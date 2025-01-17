import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/infrastructure/jwt/strategies/get-user.decorator';
import { UpdateOrderDto } from 'src/order/infraestructure/dtos/update-order.dto';
import { CreateOrderServiceEntryDto } from 'src/order/application/dto/entry/create-order-entry.dto';
import { ResponseOrderDTO } from '../dtos/response-order.dto';
import { CreateOrderService } from 'src/order/application/command/create-order-service';
import { GetOrderService } from 'src/order/application/query/get-order-service';
import { UpdateOrderService } from 'src/order/application/command/update-order-service';
import { RemoveOrderService } from 'src/order/application/command/delete-order-service';
import { UpdateOrderStatusService } from 'src/order/application/command/update-order-status-service';
import { OrderStatus } from 'src/order/domain/enums/order-status.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/user/infrastructure/typeorm/user-entity';

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
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createOrderDto: CreateOrderServiceEntryDto,
        @GetUser() user: User
    ): Promise<ResponseOrderDTO> {
        console.log('Creating order for user:', user);
        if (!user) {
        throw new UnauthorizedException('User not found');
        }
        return this.createOrderService.createOrder(createOrderDto, user.user_id);
    }

    @Get('many')
    @UseGuards(AuthGuard('jwt'))
    async findAll(
        @GetUser() user: User
    ): Promise<ResponseOrderDTO[]> {
        return this.getOrderService.findAll(user.user_id);
    }

    @Get('many/past')
    @UseGuards(AuthGuard('jwt'))
    async getPastOrders(
        @GetUser() user: User
    ): Promise<ResponseOrderDTO[]> {
        const statuses = [OrderStatus.CANCELLED, OrderStatus.DELIVERED];
        return this.getOrderService.findByStatuses(user.user_id, statuses);
    }

    @Get('many/active')
    @UseGuards(AuthGuard('jwt'))
    async getActiveOrders(
        @GetUser() user: User
    ): Promise<ResponseOrderDTO[]> {
        const statuses = [OrderStatus.BEING_PROCESSED, OrderStatus.CREATED, OrderStatus.SHIPPED];
        return this.getOrderService.findByStatuses(user.user_id, statuses);
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
