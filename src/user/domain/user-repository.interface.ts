import { User } from "../infrastructure/typeorm/user.entity";

export interface UserRepositoryInterface {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  remove(id: string): Promise<void>;
}