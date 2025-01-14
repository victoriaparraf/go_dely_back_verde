import { Injectable, NotFoundException, InternalServerErrorException, Inject } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
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
import { CloudinaryService } from 'src/common/infraestructure/cloudinary/cloudinary.service';
import { ComboWeight } from 'src/combo/domain/value-objects/combo-weight.vo';
import { ComboMeasurement } from 'src/combo/domain/value-objects/combo-measurement.vo';
import { ComboCaducityDate } from '../../domain/value-objects/combo-caducity-date.vo';
import { ClientProxy } from '@nestjs/microservices';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { Discount } from 'src/discount/infraestructure/typeorm/discount.entity';

@Injectable()
export class CreateComboService implements IApplicationService<CreateComboServiceEntryDto, CreateComboServiceResponseDto> {

  constructor(
    private readonly comboRepository: ComboRepository, 
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(Discount) private readonly discountRepository: Repository<Discount>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(entryDto: CreateComboServiceEntryDto): Promise<CreateComboServiceResponseDto> {
    try {
      const { category, productId, images, discount, ...comboDetails } = entryDto;

      const categoryEntities = await Promise.all(
        category.map(async (categoryId) => {
            const category = await this.categoryRepository.findOne({ where: { category_id: categoryId } });
            if (!category) {
                throw new NotFoundException(`Category with ID ${categoryId} not found`);
            }
            return category;
        }),
      );
            
      const productEntities = await Promise.all(
        productId.map(async (productId) => {
          const product = await this.productRepository.findOne({ where: { product_id: productId } });
          if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
          }
          return product;
        }),
      );

      const imageUrls = await Promise.all(
        images.map((image) => this.cloudinaryService.uploadImage(image, 'combos'))
      );
      const comboImages = imageUrls.map((url) => new ComboImage(url));

      let discountEntity = null;
      if(discount){
        discountEntity = await this.discountRepository.findOne({ where: { discount_id: discount } });
        if (!discountEntity) {
          throw new NotFoundException(`Discount with ID ${discount} not found`);
        }
      }

      const comboName = new ComboName(comboDetails.name);
      const comboDescription = new ComboDescription(comboDetails.description);
      const comboWeight = new ComboWeight(comboDetails.weight);
      const comboMeasurement = new ComboMeasurement(comboDetails.measurement)
      const comboCurrency = new ComboCurrency(comboDetails.currency);
      const comboPrice = new ComboPrice(comboDetails.price);
      const comboStock = new ComboStock(comboDetails.stock);
      const comboCaducityDate = new ComboCaducityDate(comboDetails.caducityDate);

      const combo = new Combo();
      combo.combo_name = comboName;
      combo.combo_description = comboDescription;
      combo.combo_price = comboPrice;
      combo.combo_weight = comboWeight;
      combo.combo_measurement = comboMeasurement;
      combo.combo_stock = comboStock;
      combo.combo_images = comboImages;
      combo.combo_currency = comboCurrency;
      combo.combo_categories = categoryEntities;
      combo.products = productEntities;
      combo.combo_caducity_date = comboCaducityDate;
      combo.discount = discountEntity;

      await this.comboRepository.saveCombo(combo);

      await Promise.all(
        productEntities.map(async (product) => {
          product.combos = [...(product.combos || []), combo];
          await this.productRepository.save(product);
        }),
      );

      this.client.emit('notification', {
        type: 'combo',
        payload: {
          comboImages: combo.combo_images,
          comboName: combo.combo_name.getValue(),
          comboCategories: combo.combo_categories.map((category) => category.category_name),
          comboWeight: combo.combo_weight.getValue(),
          comboMeasurement: combo.combo_measurement.getValue(),
          comboDescription: combo.combo_description.getValue(),
          comboProducts: combo.products.map((product) => product.product_name.getValue())
        },
      });

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
