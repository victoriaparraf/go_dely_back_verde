import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Combo } from '../infrastructure/typeorm/combo-entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { CreateComboServiceEntryDto } from '../dto/entry/create-combo-entry.dto';
import { CreateComboServiceResponseDto } from '../dto/response/create-combo-response.dto';

@Injectable()
export class CreateComboService implements IApplicationService<CreateComboServiceEntryDto, CreateComboServiceResponseDto> {

  constructor(
    rivate readonly comboRepository: ComboRepository, 
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async execute(entryDto: CreateComboServiceEntryDto): Promise<CreateComboServiceResponseDto> {
    try {
      const { category, products, image, discount, ...comboDetails } = entryDto;
      
      // Validate category
      const category = await this.categoryRepository.findOne({ where: { category_id: combo_category } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${combo_category} not found`);
      }

      // Validate products
      const productEntities = await Promise.all(
        products.map(async (productId) => {
          const product = await this.productRepository.findOne({ where: { product_id: productId } });
          if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
          }
          return product;
        }),
      );

      // Create the combo entity
      const combo = new Combo();
      combo.combo_name = combo_name;
      combo.combo_description = combo_description;
      combo.combo_price = combo_price;
      combo.combo_stock = combo_stock;
      combo.combo_category = category;
      combo.products = productEntities;

      // Save the combo to the database
      const savedCombo = await this.comboRepository.save(combo);

      // Update products with the combo reference
      productEntities.forEach(async (product) => {
        product.combos = [...(product.combos || []), savedCombo];
        await this.productRepository.save(product);
      });

      // Prepare and return the response
      const responseDto = new CreateComboServiceResponseDto();
      responseDto.combo_id = savedCombo.combo_id;
      responseDto.combo_name = savedCombo.combo_name;
      responseDto.combo_description = savedCombo.combo_description;
      responseDto.combo_price = savedCombo.combo_price;
      responseDto.combo_stock = savedCombo.combo_stock;
      responseDto.combo_category = {
        category_id: category.category_id,
        category_name: category.category_name,
      };
      responseDto.products = productEntities.map((product) => ({
        product_id: product.product_id,
        product_name: product.product_name,
      }));

      return responseDto;
    } catch (error) {
      console.error('Error creating combo:', error);
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): void {
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
