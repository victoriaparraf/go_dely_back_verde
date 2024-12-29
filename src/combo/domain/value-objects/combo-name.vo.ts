import { unvalidNameComboException } from "../exceptions/unvalid-name-combo";

export class ComboName {

    protected readonly value: string;

    constructor(value: string) {

        if (!value || value.trim().length === 0) {
            throw new unvalidNameComboException(`The name is not valid`);
        }
        this.value = value.trim();
        
    }

    public getValue(): string {
        return this.value;
    }
    
}