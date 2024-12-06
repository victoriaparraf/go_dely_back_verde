import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/infrastructure/get-user.decorator';
import { CreateOrderDto } from 'src/order/application/dto/create-order.dto';
import { UpdateOrderDto } from 'src/order/application/dto/update-order.dto';
import { UpdateOrderStatusDto } from 'src/order/application/dto/update-status.dto';
import { OrderService } from 'src/order/application/order.service';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('create')
    @UseGuards( AuthGuard('jwt') )
    create(@Body() createOrderDto: CreateOrderDto, @GetUser('user_id') user_id: string) {
        return this.orderService.createOrder(createOrderDto, user_id);
    }

    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderService.getOrderById(id);
    }

    @Patch(':id')
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
