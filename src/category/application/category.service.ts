import { CategoryRepository } from '../domain/repositories/category.repository.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../domain/category-aggregate';
import { CategoryID } from '../domain/value-objects/category-id.vo';
import { CategoryName } from '../domain/value-objects/category-name.vo';
import { CategoryDescription } from '../domain/value-objects/category-description.vo';

export class CategoryService {
    constructor(private readonly repository: CategoryRepository) {}

    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        const category = Category.create(dto.name, dto.description);
        await this.repository.save(category);
        return category;
    }

    async updateCategory(id: string, dto: UpdateCategoryDto): Promise<void> {
        const categoryId = new CategoryID(id);
        const category = await this.repository.findById(categoryId);
        if (!category) throw new Error('Category not found');

        category.updateName(new CategoryName(dto.name));
        category.updateDescription(new CategoryDescription(dto.description));

        await this.repository.save(category);
    }
}
