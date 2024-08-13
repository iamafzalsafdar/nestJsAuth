import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/DTOs/auth.dto';
import { DoesUserExist } from 'src/Guards/UserExists.Guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(DoesUserExist)
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: CreateUserDto) {
    return this.authService.create(body);
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
