import { DomainException } from "src/common/domain/domain-exception";

export class unvalidNameComboException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}