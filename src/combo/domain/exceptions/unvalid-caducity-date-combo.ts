import { DomainException } from "src/common/domain/domain-exception";

export class unvalidCaducityDateComboException extends DomainException {

    constructor(message: string) {

        super(message);

    }

}