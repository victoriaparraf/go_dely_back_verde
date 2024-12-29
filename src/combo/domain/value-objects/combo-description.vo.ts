import { unvalidDescriptionComboException } from "../exceptions/unvalid-description-combo";

export class ComboDescription {

    protected readonly value: string;
    
    constructor(value: string) {

        if (value.length < 10 || value){
            throw new unvalidDescriptionComboException(`The description is not valid`);
        }
        this.value = value;

    }
    
    public getValue(): string {
        return this.value;
    }
}