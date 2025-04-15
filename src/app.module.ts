import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService],
})
export class AppModule {}
