import { DomainException } from "src/common/domain/domain-exception";

export class unvalidPercentageDiscountException extends DomainException {

    constructor(message: string) {

        super(message);

    }

}