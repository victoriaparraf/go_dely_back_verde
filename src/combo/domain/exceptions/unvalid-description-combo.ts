import { DomainException } from "src/common/domain/domain-exception";

export class unvalidDescriptionComboException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}