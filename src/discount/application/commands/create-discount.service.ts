import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IApplicationService } from "src/common/application/application-service.interface";
import { CreateDiscountServiceEntryDto } from "../dto/entry/create-discount-entrydto";
import { CreateDiscountServiceResponseDto } from "../dto/response/create-discount-response.dto";
import { DiscountRepository } from "src/discount/infraestructure/repositories/discount-repository";
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
import { DiscountImage } from "src/discount/domain/value-objects/discount-image.vo";

@Injectable()
export class CreateDiscountService implements IApplicationService<CreateDiscountServiceEntryDto, CreateDiscountServiceResponseDto>{

    constructor(
        private readonly discountRepository: DiscountRepository,
        @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
        private readonly cloudinaryService: CloudinaryService,
        private readonly sendNotificationService: SendNotificationService
    ) {}

    async execute(entryDto: CreateDiscountServiceEntryDto): Promise<CreateDiscountServiceResponseDto> {
        try {
            
            const { image, ...discountDetails } = entryDto;

            let imageUrl = null;
            if(image) imageUrl = await this.cloudinaryService.uploadImage(image, 'discounts'); 

            const discountName = new DiscountName(discountDetails.name);
            const discountDescription = new DiscountDescription(discountDetails.description);
            const discountPercentage = new DiscountPercentage(discountDetails.percentage);
            const discountStartDate= new DiscountStartDate(discountDetails.startDate);
            const discountEndDate = new DiscountEndDate(discountDetails.deadline);
            const discountImage = new DiscountImage(imageUrl);

            const discount = new Discount();
            discount.discount_name = discountName;
            discount.discount_description = discountDescription;
            discount.discount_percentage = discountPercentage;
            discount.discount_start_date = discountStartDate;
            discount.discount_end_date = discountEndDate;
            discount.discount_image = discountImage;

            await this.discountRepository.saveDiscount(discount);

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