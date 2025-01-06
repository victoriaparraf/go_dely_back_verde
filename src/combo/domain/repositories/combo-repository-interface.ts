import { Combo } from "src/combo/infrastructure/typeorm/combo-entity";

export interface IComboRepository{
    createCombo(combo: Combo): Promise<Combo>;
    saveCombo(combo: Combo): Promise<Combo>;
    findAll(paginationDto: { page: number; perpage: number }): Promise<Combo[]>;
    findOne(term: string): Promise<Combo | undefined>;
    updateCombo(combo: Combo): Promise<Combo>;
    removeCombo(combo: Combo): Promise<Combo>;
}