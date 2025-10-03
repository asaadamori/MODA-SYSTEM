import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderProductsDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Product unit price must be a number' },
  )
  @IsPositive({ message: 'Product unit price must be a positive number' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Product quantity must be a number' })
  @IsPositive({ message: 'Product quantity must be a positive number' })
  product_quantity: number;
}
