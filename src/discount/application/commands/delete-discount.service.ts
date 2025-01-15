import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DiscountRepository } from "src/discount/infraestructure/repositories/discount-repository";

@Injectable()
export class DeleteDiscountService {

    constructor(
        private readonly discountRepository: DiscountRepository
    ){}

    async execute(discountID: string): Promise<void>{

        const discount = await this.discountRepository.findOne(discountID);

        if(!discount){
            throw new NotFoundException(`Discount with ID ${discountID} not found`)
        }

        try {
            await this.discountRepository.removeDiscount(discount);
        } catch (error) {
            console.error('Error deleting combo:', error);
            throw new InternalServerErrorException('Unexpected error, check server logs');
        }

    }

}