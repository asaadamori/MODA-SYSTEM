import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return ` Add new user name: ${createUserDto.name} and email: ${createUserDto.email} and password: ${createUserDto.password} `;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return ` {This action updates a #${id} user with name: ${updateUserDto.name} and email: ${updateUserDto.email} and password: ${updateUserDto.password} } `;
  }
}
