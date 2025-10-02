import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsNumber({}, { message: 'Product ID must be a number' })
  productId: number;

  @IsNumber({}, { message: 'Ratings must be a number' })
  ratings: number;
  @IsString({ message: 'Comment must be a string' })
  comment: string;
}
