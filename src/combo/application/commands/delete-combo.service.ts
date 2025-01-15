import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ComboRepository } from '../../infrastructure/repositories/combo-repository';

@Injectable()
export class DeleteComboService{
    constructor(
        private readonly comboRepository: ComboRepository
    ){}

    async execute(comboID: string): Promise<void> {

        const combo = await this.comboRepository.findOne(comboID);
        if(!combo){
            throw new NotFoundException(`Combo with ID ${comboID} not found`)
        }

        try {
            await this.comboRepository.removeCombo(combo);
        } catch (error) {
            console.error('Error deleting combo:', error);
            throw new InternalServerErrorException('Unexpected error, check server logs');
        }
        
    }
}