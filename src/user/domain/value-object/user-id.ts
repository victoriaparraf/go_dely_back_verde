import { ValueObject } from 'src/common/domain/value.object';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

export class UserId extends ValueObject<string> {
  constructor(value?: string) {
    super(value ?? uuidv4());
    this.validate(this.value);
  }

  protected validate(value: string): void {
    if (!validateUuid(value)) {
      throw new Error(`Invalid UUID: ${value}`);
    }
  }

  static generate(): UserId {
    return new UserId(uuidv4());
  }
}