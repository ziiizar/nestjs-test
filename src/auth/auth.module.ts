import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [ PrismaService, AuthService],
})
export class AuthModule {}
