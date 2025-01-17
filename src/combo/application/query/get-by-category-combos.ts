import { Injectable, NotFoundException } from '@nestjs/common';
import { GetComboServiceResponseDto } from '../dto/response/get-combo-response.dto';
import { ComboRepository } from 'src/combo/infrastructure/repositories/combo-repository';

@Injectable()
export class GetCombosByCategoryService {
  constructor(private readonly comboRepository: ComboRepository) {}

  async execute(categoryId: string): Promise<GetComboServiceResponseDto[]> {
    console.log(`Executing GetCombosByCategoryService with categoryId: ${categoryId}`);
    
    const combos = await this.comboRepository.findByCategory(categoryId);
    console.log(`Combos retrieved: ${JSON.stringify(combos)}`);
    
    if (!combos.length) {
      console.log(`No products found for category ID ${categoryId}`);
      throw new NotFoundException(`No products found for category ID ${categoryId}`);
    }
    
    const response = combos.map(combo => {
      console.log(`Mapping combo: ${JSON.stringify(combo)}`);
      return {
        id: combo.combo_id,
        name: combo.combo_name.getValue(),
        description: combo.combo_description.getValue(),
        price: combo.combo_price.getValue(),
        categories: combo.combo_categories ? combo.combo_categories.map(category => category.category_id) : [],
        weight: combo.combo_weight.getValue(),
        measurement: combo.combo_measurement.getValue(),
        currency: combo.combo_currency.getValue(),
        stock: combo.combo_stock.getValue(),
        images: combo.combo_images ? combo.combo_images.map(image => image.getValue()) : [],
        caducityDate: combo.combo_caducity_date ? combo.combo_caducity_date.getValue() : null,
        discount: combo.discount ? combo.discount.discount_id : null,
        products: combo.products ? combo.products.map(product => product.product_id) : [],
      };
    });
    
    console.log(`Response: ${JSON.stringify(response)}`);
    return response;
  }
}