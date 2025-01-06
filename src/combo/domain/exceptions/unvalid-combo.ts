import { DomainException } from "src/common/domain/domain-exception";

export class unvalidComboException extends DomainException {

    constructor(message: string) {

        super(message);
        
    }
}