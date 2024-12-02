import { Category } from '../category-aggregate';
import { CategoryID } from '../value-objects/category-id.vo';

export interface CategoryRepository {
    
    save(category: Category): Promise<void>;

    findById(id: CategoryID): Promise<Category | null>;

    findAll(): Promise<Category[]>

    delete(id: CategoryID): Promise<void>;
}
