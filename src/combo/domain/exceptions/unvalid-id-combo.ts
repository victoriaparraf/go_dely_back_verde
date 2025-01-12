import { DomainException } from "src/common/domain/domain-exception";

export class unvalidIDComboException extends DomainException {

    constructor(message: string) {

        super(message);
        
    }
}