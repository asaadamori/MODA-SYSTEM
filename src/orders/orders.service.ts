import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProductEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity)
    private readonly opRepository: Repository<OrderProductEntity>,
    private readonly productService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);
    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    const orderTbl = await this.orderRepository.save(orderEntity);

    const opEntity: {
      order: OrderEntity;
      product: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.products.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.products[i].id,
      );
      const product_quantity = createOrderDto.products[i].product_quantity;
      const product_unit_price = createOrderDto.products[i].product_unit_price;
      opEntity.push({
        order,
        product,
        product_quantity,
        product_unit_price,
      });
    }
    await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrderProductEntity)
      .values(opEntity)
      .execute();

    return await this.findOne(orderTbl.id);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // منع تحديث الطلبات المُسلّمة أو المُلغاة
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot update order with status ${order.status}`,
      );
    }

    // لا حاجة لتحديث إذا كانت الحالة نفسها
    if (order.status === updateOrderStatusDto.status) {
      return order;
    }

    // التحقق من صحة الانتقالات بين الحالات
    if (order.status === OrderStatus.PROCESSING) {
      // من PROCESSING يمكن الانتقال فقط إلى SHIPPED أو CANCELLED
      if (
        updateOrderStatusDto.status !== OrderStatus.SHIPPED &&
        updateOrderStatusDto.status !== OrderStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `Can only ship or cancel order from processing status`,
        );
      }
    }

    if (order.status === OrderStatus.SHIPPED) {
      // من SHIPPED يمكن الانتقال فقط إلى DELIVERED أو CANCELLED
      if (
        updateOrderStatusDto.status !== OrderStatus.DELIVERED &&
        updateOrderStatusDto.status !== OrderStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `Can only deliver or cancel order from shipped status`,
        );
      }
    }

    // تحديث timestamps حسب الحالة الجديدة
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    // تحديث الحالة والمستخدم
    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    // تحديث المخزون عند التسليم
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }

    return order;
  }

  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // منع إلغاء الطلبات المُسلّمة أو المُلغاة
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}`,
      );
    }

    // إذا كان الطلب في حالة SHIPPED، يجب تحديث المخزون
    if (order.status === OrderStatus.SHIPPED) {
      await this.stockUpdate(order, OrderStatus.CANCELLED);
    }

    // تحديث الحالة والمستخدم
    order.status = OrderStatus.CANCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }
}
