import { Injectable, NotFoundException } from '@nestjs/common';
import { ComboMapper } from 'src/combo/infrastructure/mappers/combo-mapper';
import { GetComboServiceResponseDto } from '../dto/response/get-combo-response.dto';
import { ComboRepository } from 'src/combo/infrastructure/repositories/combo-repository';

@Injectable()
export class GetCombosByCategoryService {
  constructor(private readonly comboRepository: ComboRepository) {}

  async execute(categoryId: string): Promise<GetComboServiceResponseDto[]> {
    const combos = await this.comboRepository.findByCategory(categoryId);
    if (!combos.length) {
      throw new NotFoundException(`No products found for category ID ${categoryId}`);
    }
    return combos.map(combo => ComboMapper.mapComboToResponse(combo));
  }
}