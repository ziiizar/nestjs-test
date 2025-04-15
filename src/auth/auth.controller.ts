import { Controller, Post, Body, Req, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request, @Res() res: Response) {
    console.log('uuuuuuuuuuuuuuuuuuu')
    return this.authService.login(dto, req, res);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    console.log('meeeeeeeeeeeeeeeee');
    return this.authService.getProfile(req);
  }

  @Get('test')
  test() {
    return 'test';
  }
}
