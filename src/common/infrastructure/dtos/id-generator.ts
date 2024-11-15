import { v4 as uuidv4 } from 'uuid';

export class IdGenerator {
  static generate(): string {
    return uuidv4();
  }
}
