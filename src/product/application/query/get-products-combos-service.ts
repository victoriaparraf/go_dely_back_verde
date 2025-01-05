import { Injectable } from '@nestjs/common';
import { ComboRepository } from 'src/combo/infrastructure/repositories/combo-repository';
import { ProductComboSummaryDto } from '../dto/response/product-combo-summary.dto';
import { ProductRepository } from 'src/product/infrastructure/repositories/product-repositoy';

@Injectable()
export class GetProductsCombosSummaryService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly comboRepository: ComboRepository,
  ) {}

  async execute(): Promise<ProductComboSummaryDto[]> {
    const products = await this.productRepository.findAll({ page: 1, perpage: 10 });
    const combos = await this.comboRepository.findAllCombos(10, 0);

    const productSummaries = products.map(product => ({
      id: product.product_id,
      type: 'Product' as const,
      name: product.product_name.getValue(),
    }));

    const comboSummaries = combos.map(combo => ({
      id: combo.combo_id,
      type: 'Combo' as const,
      name: combo.combo_name.getValue(),
    }));

    return [...productSummaries, ...comboSummaries];
  }
}