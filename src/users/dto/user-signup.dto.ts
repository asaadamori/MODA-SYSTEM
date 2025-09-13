import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty({ message: 'Name can not be empty' })
  name: string;
  @IsEmail({}, { message: 'Email format is not correct' })
  @IsNotEmpty({ message: 'Email can not be empty ' })
  email: string;
  @IsNotEmpty({ message: 'password shud not be empty' })
  @MinLength(6, { message: 'Password shuld be at least 6 character' })
  password: string;
}
