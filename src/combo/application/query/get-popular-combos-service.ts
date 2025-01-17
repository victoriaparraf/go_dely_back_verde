import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/order/infraestructure/typeorm/order-repository';
import { ComboRepository } from 'src/combo/infrastructure/repositories/combo-repository';
import { ComboMapper } from 'src/combo/infrastructure/mappers/combo-mapper';

@Injectable()
export class GetPopularCombosService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly comboRepository: ComboRepository,
  ) {}

  async execute(page: number, perpage: number): Promise<any[]> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const orders = await this.orderRepository.findComboOrdersByDateRange(startOfMonth, endOfMonth);

    const comboCounts = orders.reduce((acc, order) => {
      if (order.order_combos) {
        order.order_combos.forEach(combo => {
          acc[combo.combo_id] = (acc[combo.combo_id] || 0) + combo.quantity;
        });
      }
      return acc;
    }, {});

    const comboIds = Object.keys(comboCounts).sort((a, b) => comboCounts[b] - comboCounts[a]);
    console.log(comboIds)

    const combos = await this.comboRepository.findCombosByIds(comboIds);
    console.log(combos)

    return combos.map(combo => ComboMapper.mapComboToResponse(combo)).slice((page - 1) * perpage, page * perpage);
  }

}
