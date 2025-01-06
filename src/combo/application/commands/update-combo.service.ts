import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { ComboRepository } from '../../infrastructure/repositories/combo-repository';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateComboServiceEntryDto } from '../dto/entry/update-combo-entry.dto';
import { ComboName } from 'src/combo/domain/value-objects/combo-name.vo';
import { ComboDescription } from 'src/combo/domain/value-objects/combo-description.vo';
import { ComboCurrency } from 'src/combo/domain/value-objects/combo-currency.vo';
import { ComboPrice } from 'src/combo/domain/value-objects/combo-price.vo';
import { ComboStock } from 'src/combo/domain/value-objects/combo-stock.vo';
import { ComboImage } from 'src/combo/domain/value-objects/combo-image.vo';

@Injectable()
export class UpdateComboService {

    constructor(
        private readonly comboRepository: ComboRepository,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    ){}

    async execute(updateEntryDto: UpdateComboServiceEntryDto): Promise<void>{

        const{ combo_id, combo_category, products, ...comboDetails } = updateEntryDto;
        
        const combo = await this.comboRepository.findOne(combo_id);
        if(!combo){
            throw new NotFoundException(`Combo with ID ${combo_id} not found`);
        }

        if(combo_category){
            const categoryEntity = await this.categoryRepository.findOne({
                where: { category_id: combo_category }
            })
            if (!categoryEntity){
                throw new NotFoundException(`Category with ID ${combo_id} not found`);
            }
            combo.combo_category = categoryEntity;
        }

        if(products){
            const productEntities = await Promise.all(
                products.map(async (productId) => {
                    const product = await this.productRepository.findOne({ where: { product_id: productId } });
                    if (!product) {
                        throw new NotFoundException(`Product with ID ${productId} not found`);
                    }
                    return product;
                }),
            );
            combo.products = productEntities;
        }

        if(comboDetails.combo_name) combo.combo_name = new ComboName(comboDetails.combo_name);
        if(comboDetails.combo_description) combo.combo_description = new ComboDescription(comboDetails.combo_description);
        if(comboDetails.combo_currency) combo.combo_currency = new ComboCurrency(comboDetails.combo_currency);
        if(comboDetails.combo_price) combo.combo_price = new ComboPrice(comboDetails.combo_price);
        if(comboDetails.combo_stock) combo.combo_stock = new ComboStock(comboDetails.combo_stock);
        if(comboDetails.combo_image) combo.combo_image = new ComboImage(comboDetails.combo_image).getValue();

        try {
            await this.comboRepository.saveCombo(combo);
        } catch (error) {
            console.error('Error updating combo:', error);
            throw new InternalServerErrorException('Unexpected error, check server logs');
        }
    }

}