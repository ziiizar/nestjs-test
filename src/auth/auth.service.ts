import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    try {
      const { email, password, name, state } = dto;

      const existingUser = await this.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new UnauthorizedException('El usuario ya existe');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          state,
        },
      });

      const { password: _, ...result } = user;
      return { success: 'Usuario registrado', user: result };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error('Error al registrar el usuario');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return { success: 'Usuario autenticado', access_token: token };
  }

  async getProfile(access_token: string) {
    const decoded = this.jwtService.verify(access_token);
    const user = await this.db.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        name: true,
        state: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }
}
