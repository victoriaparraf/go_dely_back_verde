import { CategoryName } from './value-objects/category-name.vo';
import { CategoryDescription } from './value-objects/category-description.vo';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

export class CategoryAggregate {
  private readonly id: string;
  private name: CategoryName;
  private description: CategoryDescription;
  private readonly products: Product[];

  constructor(
    id: string, 
    name: CategoryName, 
    description: CategoryDescription, 
    products: Product[] = []
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.products = products;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name.getValue();
  }

  getDescription(): string {
    return this.description.getValue();
  }

  getProducts(): Product[] {
    return this.products;
  }

  updateName(name: CategoryName): void {
    this.name = name;
  }

  updateDescription(description: CategoryDescription): void {
    this.description = description;
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }
}
