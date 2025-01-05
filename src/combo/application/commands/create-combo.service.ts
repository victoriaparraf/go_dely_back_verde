import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { CreateComboServiceEntryDto } from '../dto/entry/create-combo-entry.dto';
import { CreateComboServiceResponseDto } from '../dto/response/create-combo-response.dto';
import { ComboRepository } from 'src/combo/infrastructure/repositories/combo-repository';
import { ComboName } from 'src/combo/domain/value-objects/combo-name.vo';
import { ComboDescription } from '../../domain/value-objects/combo-description.vo';
import { ComboCurrency } from 'src/combo/domain/value-objects/combo-currency.vo';
import { ComboPrice } from 'src/combo/domain/value-objects/combo-price.vo';
import { ComboImage } from '../../domain/value-objects/combo-image.vo';
import { ComboStock } from 'src/combo/domain/value-objects/combo-stock.vo';
import { ComboMapper } from 'src/combo/infrastructure/mappers/combo-mapper';

@Injectable()
export class CreateComboService implements IApplicationService<CreateComboServiceEntryDto, CreateComboServiceResponseDto> {

  constructor(
    private readonly comboRepository: ComboRepository, 
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async execute(entryDto: CreateComboServiceEntryDto): Promise<CreateComboServiceResponseDto> {
    try {
      const { category, products, ...comboDetails } = entryDto;

      const categoryEntity = await this.categoryRepository.findOne({ where: { category_id: category } });
      if (!categoryEntity) {
        throw new NotFoundException(`Category with ID ${category} not found`);
      }
      
      const productEntities = await Promise.all(
        products.map(async (productId) => {
          const product = await this.productRepository.findOne({ where: { product_id: productId } });
          if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
          }
          return product;
        }),
      );

      const comboName = new ComboName(comboDetails.name);
      const comboDescription = new ComboDescription(comboDetails.description);
      const comboCurrency = new ComboCurrency(comboDetails.currency);
      const comboPrice = new ComboPrice(comboDetails.price);
      const comboImage = new ComboImage(comboDetails.image);
      const comboStock = new ComboStock(comboDetails.stock);

      const combo = new Combo();
      combo.combo_name = comboName;
      combo.combo_description = comboDescription;
      combo.combo_price = comboPrice;
      combo.combo_stock = comboStock;
      combo.combo_image = comboImage.getValue();
      combo.combo_currency = comboCurrency;
      combo.combo_category = categoryEntity;
      combo.products = productEntities;

      await this.comboRepository.saveCombo(combo);

      // Update products with the combo reference

      return ComboMapper.mapComboToResponse(combo);
      
    } catch (error) {
      console.error('Error creating combo:', error);
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): void {
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
