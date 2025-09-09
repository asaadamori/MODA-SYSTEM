import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
