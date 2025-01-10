import { IApplicationService } from "src/common/application/application-service.interface";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GetDiscountServiceEntryDto, GetDiscountServicePaginationDto } from "../dto/entry/get-discount-entry.dto";
import { GetDiscountServiceResponseDto } from "../dto/response/get-discount-response.dto";
import { DiscountRepository } from "src/discount/infraestructure/repositories/discount-repository";
import { DiscountMapper } from "src/discount/infraestructure/mappers/discount-mapper";

@Injectable()
export class GetDiscountService implements IApplicationService<GetDiscountServiceEntryDto, GetDiscountServiceResponseDto> {
    
    constructor(
        private readonly discountRepository: DiscountRepository,
    ) {}

    async execute(entryDto: GetDiscountServiceEntryDto): Promise<GetDiscountServiceResponseDto> {

        const discount = await this.discountRepository.findOne(entryDto.term);
        if (!discount) {
            throw new NotFoundException(`Discount with term ${entryDto.term} not found`);
        }
        return DiscountMapper.mapDiscountToResponse(discount);

    }

    async findAll(paginationDto: GetDiscountServicePaginationDto): Promise<GetDiscountServiceResponseDto[]> {

        const discounts = await this.discountRepository.findAll(paginationDto);
        return discounts.map( discount => DiscountMapper.mapDiscountToResponse(discount));
        
    }
}