import { ValueObject } from "src/common/domain/value.object";
import { unvalidMeasurementComboException } from "../exceptions/unvalid-measurement-combo";

export class ComboMeasurement extends ValueObject<string>{

    public readonly value: string;

    constructor(value: string) {
        super(value);
        this.validate(value);      
    }

    protected validate(value: string): void {
        if (!this.isValidMeasurement(value)) {
            throw new unvalidMeasurementComboException(`Measurement '${value}' is not valid`);
        }
    }

    private isValidMeasurement(value: string): boolean {
        return /^[a-z]{2}$/.test(value);
    }

    public getValue(): string {
        return this.value;
    }
}
