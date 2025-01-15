import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/infrastructure/get-user.decorator';
import { UpdateOrderDto } from 'src/order/infraestructure/dtos/update-order.dto';
import { UpdateOrderStatusDto } from 'src/order/infraestructure/dtos/update-status.dto';
import { OrderService } from 'src/order/application/order.service';
import { CreateOrderServiceEntryDto } from 'src/order/application/dto/entry/create-order-entry.dto';
import { ResponseOrderDTO } from '../dtos/response-order.dto';
import { CreateOrderService } from 'src/order/application/command/create-order-service';
import { GetOrderService } from 'src/order/application/query/get-order-service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly createOrderService: CreateOrderService,
        private readonly getOrderService: GetOrderService,
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

    @Get('one/:id')
    async getOrderById(@Param('id') orderId: string): Promise<ResponseOrderDTO | null> {
        return this.getOrderService.execute(orderId);
    }

    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        await this.orderService.updateOrder(id, updateOrderDto);
        return {
            message: `Order successfully updated`
        };
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto): Promise<{ message: string }> {
        await this.orderService.updateOrderStatus(id, dto.status);
        return {
            message: `Order status successfully updated`
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.orderService.remove(id);
        return {
            message: `Order successfully deleted`
        };
    }
}
