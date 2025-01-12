import { DomainException } from "src/common/domain/domain-exception";

export class unvalidImageComboException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}