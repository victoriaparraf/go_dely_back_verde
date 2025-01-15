import { CloudinaryService } from "src/common/infraestructure/cloudinary/cloudinary.service";
import { DiscountRepository } from "src/discount/infraestructure/repositories/discount-repository";
import { UpdateDiscountServiceEntryDto } from "../dto/entry/update-discount-entry.dto";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DiscountImage } from "src/discount/domain/value-objects/discount-image.vo";
import { DiscountName } from "src/discount/domain/value-objects/discount-name.vo";
import { DiscountDescription } from "src/discount/domain/value-objects/discount-description.vo";
import { DiscountPercentage } from "src/discount/domain/value-objects/discount-percentage.vo";
import { DiscountStartDate } from "src/discount/domain/value-objects/discount-start-date.vo";
import { DiscountEndDate } from "src/discount/domain/value-objects/discount-end-date.vo";

@Injectable()
export class UpdateDiscountService {

    constructor(
        private readonly discountRepository: DiscountRepository,
        private readonly cloudinaryService: CloudinaryService,
    ){}

    async execute(updateEntryDto:UpdateDiscountServiceEntryDto): Promise<void>{
        
        const{ id, image, ...discountDetails} = updateEntryDto;

        const discount = await this.discountRepository.findOne(id);

        if(!discount){
            throw new NotFoundException(`Combo with ID ${id} not found`);
        }

        if(image){
            const imageUrl = await this.cloudinaryService.uploadImage(image, 'discounts'); 
            discount.discount_image = new DiscountImage(imageUrl);
        }

        if(discountDetails.name) discount.discount_name = new DiscountName(discountDetails.name);
        if(discountDetails.description) discount.discount_description = new DiscountDescription(discountDetails.description);
        if(discountDetails.percentage) discount.discount_percentage = new DiscountPercentage(discountDetails.percentage);
        if(discountDetails.startDate) discount.discount_start_date = new DiscountStartDate(discountDetails.startDate);
        if(discountDetails.deadline) discount.discount_end_date = new DiscountEndDate(discountDetails.deadline);

        try {
            await this.discountRepository.saveDiscount(discount);
        } catch (error) {
            console.error('Error updating combo:', error);
            throw new InternalServerErrorException('Unexpected error, check server logs');
        }
    }
}