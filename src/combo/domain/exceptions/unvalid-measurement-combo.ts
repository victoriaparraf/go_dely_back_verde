import { DomainException } from "src/common/domain/domain-exception";

export class unvalidMeasurementComboException extends DomainException {

    constructor(message: string) {

    super(message);
    
    }

}