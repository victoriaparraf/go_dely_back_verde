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
import { GetPopularCombosService } from 'src/combo/application/query/get-popular-combos-service';
import { GetCombosByCategoryService } from '../../application/query/get-by-category-combos';

@ApiTags('Combo')
@Controller('bundle')
export class ComboController {
  constructor(
    private readonly createComboService: CreateComboService,
    private readonly getComboService: GetComboService,
    private readonly deleteComboService: DeleteComboService,
    private readonly updateComboService: UpdateComboService,
    private readonly getPopularCombosService: GetPopularCombosService,
    private readonly getCombosByCategoryService: GetCombosByCategoryService
  ) {}

  @Post('create')
  async create(@Body() createComboDto: CreateComboDto) {

    const createComboServiceEntryDto: CreateComboServiceEntryDto = {
      stock: createComboDto.stock ?? 0,
      ...createComboDto
    };

    const combo = await this.createComboService.execute(createComboServiceEntryDto);

    console.log('Created combo response:', combo);

    return combo;

  }

  @Get('many')
  async findAll(@Query() paginationDto?: PaginationDto) {

    const getComboServicePaginationDto: GetComboServicePaginationDto = {
      page: paginationDto?.page || 1,
      perpage: paginationDto?.perpage || 10,
    };

    return this.getComboService.findAll(getComboServicePaginationDto);

  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.getCombosByCategoryService.execute(categoryId);
  }

  @Get('many/popular')
  async findPopular(@Query() paginationDto: PaginationDto) {
    const page = paginationDto?.page || 1;
    const perpage = paginationDto?.perpage || 10;

    const combos = await this.getPopularCombosService.execute(page, perpage);

    return combos;
  }

  @Get('one/:term')
  async findOne(@Param('term') id: string) {

    const getComboServiceEntryDto: GetComboServiceEntryDto = { id }
    return this.getComboService.execute(getComboServiceEntryDto);
  }

  @Patch('update/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateComboDto: UpdateComboDto) {

    const updateComboServiceEntryDto: UpdateComboServiceEntryDto = { id, ...updateComboDto };

    await this.updateComboService.execute(updateComboServiceEntryDto);
    
    return { message: 'Combo updated successfully' };
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {

    await this.deleteComboService.execute(id);
    return { message: 'Combo deleted successfully' };

  }
}