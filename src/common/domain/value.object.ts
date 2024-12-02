export abstract class ValueObject<T> {
    readonly value: T;

    constructor(value: T) {
        this.value = value;
        this.validate(value);
    }

    protected abstract validate(value: T): void;

    equals(vo: ValueObject<T>): boolean {
        return vo.value === this.value;
    }
}
