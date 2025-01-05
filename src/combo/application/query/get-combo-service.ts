import { IApplicationService } from "src/common/application/application-service.interface";
import { GetComboServiceEntryDto, GetComboServicePaginationDto } from "../dto/entry/get-combo-entry.dto";
import { GetComboServiceResponseDto } from "../dto/response/get-combo-response.dto";
import { IComboRepository } from "src/combo/domain/repositories/combo-repository-interface";
import { NotFoundException } from "@nestjs/common";
import { ComboMapper } from "src/combo/infrastructure/mappers/combo-mapper";

export class GetComboService implements IApplicationService<GetComboServiceEntryDto, GetComboServiceResponseDto> {
    
    constructor(
        private readonly comboRepository: IComboRepository,
    ) {}

    async execute(entryDto: GetComboServiceEntryDto): Promise<GetComboServiceResponseDto> {

        const combo = await this.comboRepository.findOne(entryDto.term);
        if (!combo) {
            throw new NotFoundException(`Combo with term ${entryDto.term} not found`);
        }
        return ComboMapper.mapComboToResponse(combo);

    }

    async findAll(paginationDto: GetComboServicePaginationDto): Promise<GetComboServiceResponseDto[]> {

        const combos = await this.comboRepository.findAll(paginationDto);
        return combos.map(combo => ComboMapper.mapComboToResponse(combo));
        
    }
}