import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request & { user: { userId: number } }) {
    const access_token = req.headers.authorization?.split(' ')[1];
    if (!access_token) {
      throw new UnauthorizedException('No se proporcionó un token de acceso');
    }
    return this.authService.getProfile(access_token);
  }
}
