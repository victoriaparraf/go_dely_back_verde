import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateDiscountServiceEntryDto } from '../application/dto/entry/create-discount-entrydto';
import { CreateDiscountService } from '../application/commands/create-discount.service';
import { CreateDiscountDto } from './dtos/create-discount.dto';
import { GetDiscountService } from '../application/query/get-discount.service';
import { GetDiscountServiceEntryDto, GetDiscountServicePaginationDto } from '../application/dto/entry/get-discount-entry.dto';
import { UpdateDiscountService } from '../application/commands/update-discount.service';
import { UpdateDiscountServiceEntryDto } from '../application/dto/entry/update-discount-entry.dto';
import { UpdateDiscountDto } from './dtos/update-discount.dto';
import { DeleteDiscountService } from '../application/commands/delete-discount.service';

@ApiTags('Discount')
@Controller('discount')
export class DiscountController {
  constructor(
    private readonly createDiscountService: CreateDiscountService,
    private readonly getDiscountService: GetDiscountService,
    private readonly updateDiscountService: UpdateDiscountService,
    private readonly deleteDiscountService: DeleteDiscountService
  ) {}

  @Post('create')
  async create(@Body() createDiscountDto: CreateDiscountDto) {

    const createDiscountServiceEntryDto: CreateDiscountServiceEntryDto = { 
      ...createDiscountDto
    }
    
    const discount = await this.createDiscountService.execute(createDiscountServiceEntryDto);

    console.log('Created discount response:', discount);

    return discount;
  }

  @Get('one/:id')
  async findOne(@Param('id') id: string) {
    const getDiscountServiceEntryDto: GetDiscountServiceEntryDto = { id }
    return this.getDiscountService.execute(getDiscountServiceEntryDto);
  }

  @Get('many')
  async findAll(@Query() paginationDto: PaginationDto) {

    const getdiscountServicepaginationDto: GetDiscountServicePaginationDto = {
      page: paginationDto.page,
      perpage: paginationDto.perpage,
    }

    return this.getDiscountService.findAll(getdiscountServicepaginationDto);
  }

  @Patch('update/:id')
  async update(@Param('discount_id', ParseUUIDPipe) id: string, @Body() updateDiscountDto: UpdateDiscountDto) {

    const updateDiscountServiceEntryDto: UpdateDiscountServiceEntryDto = { id, ...updateDiscountDto };

    await this.updateDiscountService.execute(updateDiscountServiceEntryDto);

    return { message: 'Discount updated successfully' };
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {

    await this.deleteDiscountService.execute(id);
    return { message: 'Combo deleted successfully' };

  }

}
