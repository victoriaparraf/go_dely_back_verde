import { DomainException } from "src/common/domain/domain-exception";

export class unvalidEndDateDiscountException extends DomainException {

    constructor(message: string) {

        super(message);

    }

}