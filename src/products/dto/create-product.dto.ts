import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with a maximum of 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsNotEmpty({ message: 'Stock is required' })
  @IsNumber({}, { message: 'Stock must be a number' })
  @IsPositive({ message: 'Stock must be a positive number' })
  stock: number;

  @IsNotEmpty({ message: 'Images are required' })
  @IsArray({ message: 'Images must be an array of strings' })
  images: string[];

  @IsNotEmpty({ message: 'Category is required' })
  @IsNumber({}, { message: 'Category must be a number' })
  categoryId: number;
}
