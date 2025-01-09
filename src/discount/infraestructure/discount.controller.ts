import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateDiscountServiceEntryDto } from '../application/dto/entry/create-discount-entrydto';
import { CreateDiscountService } from '../application/commands/create-discount.service';
import { CreateDiscountDto } from './dtos/create-discount.dto';


@ApiTags('Discount')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly createDiscountService: CreateDiscountService) {}

  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {

    const createDiscountServiceEntryDto: CreateDiscountServiceEntryDto={ 
      ...createDiscountDto
    }
    
    const discount = await this.createDiscountService.execute(createDiscountServiceEntryDto);

    console.log('Created discount response:', discount);

    return discount;
  }
}


//   @Get()
//   findAll(@Query() paginationDto: PaginationDto) {
//     return this.discountService.findAll(paginationDto);
//   }

//   @Get(':term')
//   findOne(@Param('term') term: string) {
//     return this.discountService.findOne(term);
//   }

//   @Patch(':discount_id')
//   update(@Param('discount_id', ParseUUIDPipe) discount_id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
//     return this.discountService.update(discount_id, updateDiscountDto);
//   }

//   @Delete(':discount_id')
//   remove(@Param('discount_id') discount_id: string) {
//     return this.discountService.remove(discount_id);
//   }
// }
