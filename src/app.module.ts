import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { envVarsSchema } from './config/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envVarsSchema }),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
})
export class AppModule {}
