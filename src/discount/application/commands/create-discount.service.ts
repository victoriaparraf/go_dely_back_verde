import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IApplicationService } from "src/common/application/application-service.interface";
import { CreateDiscountServiceEntryDto } from "../dto/entry/create-discount-entrydto";
import { CreateDiscountServiceResponseDto } from "../dto/response/create-discount-response.dto";
import { DiscountRepository } from "src/discount/infraestructure/repositories/discount-repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/product/infrastructure/typeorm/product-entity";
import { Repository } from "typeorm";
import { Combo } from "src/combo/infrastructure/typeorm/combo-entity";
import { ClientProxy } from "@nestjs/microservices";
import { CloudinaryService } from "src/common/infraestructure/cloudinary/cloudinary.service";
import { DiscountName } from "src/discount/domain/value-objects/discount-name.vo";
import { DiscountDescription } from "src/discount/domain/value-objects/discount-description.vo";
import { DiscountPercentage } from "src/discount/domain/value-objects/discount-percentage.vo";
import { DiscountStartDate } from "src/discount/domain/value-objects/discount-start-date.vo";
import { DiscountEndDate } from "src/discount/domain/value-objects/discount-end-date.vo";
import { Discount } from "src/discount/infraestructure/typeorm/discount.entity";
import { DiscountMapper } from "src/discount/infraestructure/mappers/discount-mapper";
import { SendNotificationService } from "src/notification/application/services/send-notification.service";

@Injectable()
export class CreateDiscountService implements IApplicationService<CreateDiscountServiceEntryDto, CreateDiscountServiceResponseDto>{

    constructor(
        private readonly discountRepository: DiscountRepository,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(Combo) private readonly comboRepository: Repository<Combo>,
        @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
        private readonly cloudinaryService: CloudinaryService,
        private readonly sendNotificationService: SendNotificationService
    ) {}

    async execute(entryDto: CreateDiscountServiceEntryDto): Promise<CreateDiscountServiceResponseDto> {
        try {
            
            const { products, combos, discount_image, ...discountDetails } = entryDto;

            let productEntities = [];
            if (products){
                productEntities = await Promise.all(
                    products.map(async (productId) => {
                        const product = await this.productRepository.findOne({ where: { product_id: productId } });
                        if (!product) {
                            throw new NotFoundException(`Product with ID ${productId} not found`);
                        }
                        return product;
                    }),
                );
            }

            let comboEntities = [];
            if (combos){
                comboEntities = await Promise.all(
                    combos.map(async (comboId) => {
                        const combo = await this.comboRepository.findOne({ where: { combo_id: comboId } });
                        if (!combo) {
                            throw new NotFoundException(`Combo with ID ${comboId} not found`);
                        }
                        return combo;
                    }),
                );
            }

            let imageUrl = null;
            if(discount_image) imageUrl = await this.cloudinaryService.uploadImage(discount_image, 'discounts'); 

            const discountName = new DiscountName(discountDetails.discount_name);
            const discountDescription = new DiscountDescription(discountDetails.discount_description);
            const discountPercentage = new DiscountPercentage(discountDetails.discount_percentage);
            const discountStartDate= new DiscountStartDate(discountDetails.discount_start_date);
            const discountEndDate = new DiscountEndDate(discountDetails.discount_end_date);

            const discount = new Discount();
            discount.discount_name = discountName;
            discount.discount_description = discountDescription;
            discount.discount_percentage = discountPercentage;
            discount.discount_start_date = discountStartDate;
            discount.discount_end_date = discountEndDate;
            discount.discount_image = imageUrl;
            discount.products = productEntities;
            discount.combos = comboEntities;

            await this.discountRepository.saveDiscount(discount);

            await Promise.all(
                productEntities.map(async (product)=> {
                    product.discount = [ ...(product.discount || null), product ];
                    await this.productRepository.save(product);
                })
            );

            await Promise.all(
                comboEntities.map( async (combo)=> {
                    combo.discount = [ ...(combo.discount || null), combo ];
                    await this.comboRepository.save(combo);
                })
            );

            this.client.emit('notification',{
                type: 'discount',
                payload:{
                    data: DiscountMapper.mapDiscountToResponse(discount)
                }
            });

            await this.sendNotificationService.notifyUsersAboutDiscount(DiscountMapper.mapDiscountToResponse(discount));

            return DiscountMapper.mapDiscountToResponse(discount);

        } catch (error) {
            console.error('Error creating Discount:', error);
            this.handleDBExceptions(error);
        }
    }

    private handleDBExceptions(error: any): void {
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}