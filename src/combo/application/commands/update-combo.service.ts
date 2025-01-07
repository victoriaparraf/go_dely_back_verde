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
import { CloudinaryService } from 'src/common/infraestructure/cloudinary/cloudinary.service';

@Injectable()
export class UpdateComboService {

    constructor(
        private readonly comboRepository: ComboRepository,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
        private readonly cloudinaryService: CloudinaryService
    ){}

    async execute(updateEntryDto: UpdateComboServiceEntryDto): Promise<void>{

        const{ combo_id, combo_categories, products, ...comboDetails } = updateEntryDto;
        
        const combo = await this.comboRepository.findOne(combo_id);
        if(!combo){
            throw new NotFoundException(`Combo with ID ${combo_id} not found`);
        }

        if(combo_categories){
            const categoryEntities = await Promise.all(
                combo_categories.map(async (categoryId) => {
                    const category = await this.categoryRepository.findOne({ where: { category_id: categoryId } });
                    if (!category) {
                        throw new NotFoundException(`Category with ID ${categoryId} not found`);
                    }
                    return category;
                }),
            );
            
            combo.combo_categories = categoryEntities;
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

        if(comboDetails.combo_image){
            // const oldImagePublicId = this.extractPublicIdFromUrl(comboDetails.combo_image);
            // await this.cloudinaryService.deleteImage(oldImagePublicId);

            const imageUrl = await this.cloudinaryService.uploadImage(comboDetails.combo_image, 'combos');
            combo.combo_image = new ComboImage(imageUrl).getValue();
        }

        if(comboDetails.combo_name) combo.combo_name = new ComboName(comboDetails.combo_name);
        if(comboDetails.combo_description) combo.combo_description = new ComboDescription(comboDetails.combo_description);
        if(comboDetails.combo_currency) combo.combo_currency = new ComboCurrency(comboDetails.combo_currency);
        if(comboDetails.combo_price) combo.combo_price = new ComboPrice(comboDetails.combo_price);
        if(comboDetails.combo_stock) combo.combo_stock = new ComboStock(comboDetails.combo_stock);

        try {
            await this.comboRepository.saveCombo(combo);
        } catch (error) {
            console.error('Error updating combo:', error);
            throw new InternalServerErrorException('Unexpected error, check server logs');
        }
    }

    extractPublicIdFromUrl(url: string): string {
        const parts = url.split('/');
        const file = parts[parts.length - 1];
        const [publicId] = file.split('.');
        return `combos/${publicId}`;
    }

}