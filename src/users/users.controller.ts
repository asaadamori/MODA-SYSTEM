import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUp } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() userSignUp: UserSignUp): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signup(userSignUp) };
  }
}
