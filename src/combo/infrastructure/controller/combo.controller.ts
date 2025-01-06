import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateComboService } from '../../application/commands/create-combo.service';
import { GetComboService } from '../../application/query/get-combo-service';
import { DeleteComboService } from '../../application/commands/delete-combo.service';
import { UpdateComboService } from '../../application/commands/update-combo.service';
import { GetComboServiceEntryDto, GetComboServicePaginationDto } from '../../application/dto/entry/get-combo-entry.dto';
import { CreateComboDto } from '../dtos/create-combo.dto';
import { UpdateComboDto } from '../dtos/update-combo.dto';
import { UpdateComboServiceEntryDto } from '../../application/dto/entry/update-combo-entry.dto';
import { CreateComboServiceEntryDto } from 'src/combo/application/dto/entry/create-combo-entry.dto';

@ApiTags('Combo')
@Controller('combos')
export class ComboController {
  constructor(
    private readonly createComboService: CreateComboService,
    private readonly getComboService: GetComboService,
    private readonly deleteComboService: DeleteComboService,
    private readonly updateComboService: UpdateComboService
  ) {}

  @Post('create')
  async create(@Body() createComboDto: CreateComboDto) {

    const createComboServiceEntryDto: CreateComboServiceEntryDto = {
      combo_stock: createComboDto.combo_stock ?? 0,
      ...createComboDto
    };

    const combo = await this.createComboService.execute(createComboServiceEntryDto);

    console.log('Created combo response:', combo);

  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {

    const getComboServicePaginationDto: GetComboServicePaginationDto = {
      page: paginationDto.page,
      perpage: paginationDto.perpage,
    };

    return this.getComboService.findAll(getComboServicePaginationDto);

  }

  @Get(':term')
  async findOne(@Param('term') term: string) {

    const getComboServiceEntryDto: GetComboServiceEntryDto = { term }
    return this.getComboService.execute(getComboServiceEntryDto);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateComboDto: UpdateComboDto) {

    const updateComboServiceEntryDto: UpdateComboServiceEntryDto = { combo_id: id, ...updateComboDto };

    await this.updateComboService.execute(updateComboServiceEntryDto);
    
    return { message: 'Combo updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {

    await this.deleteComboService.execute(id);
    return { message: 'Combo deleted successfully' };

  }
}