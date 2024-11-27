import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from '../application/dto/create-discount.dto';
import { UpdateDiscountDto } from '../application/dto/update-discount.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@ApiTags('Discount')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.discountService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.discountService.findOne(term);
  }

  @Patch(':discount_id')
  update(@Param('discount_id', ParseUUIDPipe) discount_id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(discount_id, updateDiscountDto);
  }

  @Delete(':discount_id')
  remove(@Param('discount_id') discount_id: string) {
    return this.discountService.remove(discount_id);
  }
}
