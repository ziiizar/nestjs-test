import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}

  async signup(dto: SignupDto) {
    try {
      const { email, password, name, state } = dto;

      // Verificar si el usuario ya existe
      const existingUser = await this.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return { error: 'El usuario ya existe' };
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el usuario
      const user = await this.db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          state,
        },
      });

      return { user };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error('Error al registrar el usuario');
    }
  }

  async login(dto: LoginDto, req: Request, res: Response) {
    try {
      const user = await this.db.user.findUnique({
        where: { email: dto.email },
      });

      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      console.log('user', user);
      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Error al guardar sesión:', err);
            reject(new Error('Error al guardar sesión'));
          } else {
            resolve();
          }
        });
      });
      console.log('req.session.userId', req.session);
      res.send({ success: 'Login exitoso' });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { error: 'Error al iniciar sesión' };
    }
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) throw err;
      res.clearCookie('connect.sid');
      res.send({ message: 'Sesión cerrada' });
    });
  }

  async getProfile(req: Request) {
    try {
      const userId = req.session.userId;
      console.log('Cookies recibidas:', req.headers.cookie);
      console.log('Session ID:', req.sessionID);
      console.log('Session completa:', req.session);
      console.log('userIdddddddddddddddddddddd', userId);
      if (!userId) {
        throw new UnauthorizedException('No autenticado');
      }

      const user = await this.db.user.findUnique({ where: { id: userId } });
      if (!user) {
        return { message: 'No autenticado' };
      }
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        state: user.state,
      };
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      throw new Error('Error al obtener el perfil');
    }
  }
}
