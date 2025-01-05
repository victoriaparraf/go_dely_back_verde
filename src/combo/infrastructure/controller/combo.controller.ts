import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ComboService } from '../combo.service';
import { CreateComboDto } from '../application/dto/create-combo.dto';
import { UpdateComboDto } from '../application/dto/update-combo.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Combo')
@Controller('combos')
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post('create')
  create(@Body() createComboDto: CreateComboDto) {
    return this.comboService.create(createComboDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.comboService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.comboService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateComboDto: UpdateComboDto) {
    return this.comboService.update(id, updateComboDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.comboService.remove(id);
  }
}