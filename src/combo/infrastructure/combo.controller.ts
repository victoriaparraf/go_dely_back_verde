import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComboService } from './combo.service';
import { CreateComboDto } from '../application/dto/create-combo.dto';
import { UpdateComboDto } from '../application/dto/update-combo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Combo')
@Controller('combos')
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post()
  create(@Body() createComboDto: CreateComboDto) {
    return this.comboService.create(createComboDto);
  }

  @Get()
  findAll() {
    return this.comboService.findAll();
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