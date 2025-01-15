import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/order/infraestructure/typeorm/order-repository';
import { ProductMapper } from 'src/product/infrastructure/mappers/product-mapper';
import { ProductRepository } from 'src/product/infrastructure/repositories/product-repositoy';

@Injectable()
export class GetPopularProductsService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(page: number, perpage: number): Promise<any[]> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const orders = await this.orderRepository.findOrdersByDateRange(startOfMonth, endOfMonth);

    const productCounts = orders.reduce((acc, order) => {
      order.order_products.forEach(product => {
        acc[product.product_id] = (acc[product.product_id] || 0) + product.quantity;
      });
      return acc;
    }, {});

    const productIds = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);
    console.log(productIds)

    const products = await this.productRepository.findProductsByIds(productIds);
    console.log(products)

    return products.map(product => ProductMapper.mapProductToResponse(product)).slice((page - 1) * perpage, page * perpage);
  }

}
