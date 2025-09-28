import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  title: string;

  @PrimaryColumn()
  description: string;

  @PrimaryColumn({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @PrimaryColumn()
  stock: number;

  @PrimaryColumn('simple-array')
  images: string[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.products)
  addedBy: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;
}
