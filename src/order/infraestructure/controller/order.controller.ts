import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/order/application/dto/create-order.dto';
import { UpdateOrderDto } from 'src/order/application/dto/update-order.dto';
import { UpdateOrderStatusDto } from 'src/order/application/dto/update-status.dto';
import { OrderService } from 'src/order/application/order.service';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('create')
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
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
    update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.orderService.updateOrder(id, updateOrderDto);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto): Promise<{ message: string }> {
        const updatedStatus = await this.orderService.updateOrderStatus(id, dto.status);
        return {
            message: `Order status successfully updated`
        };
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderService.remove(id);
    }
}
