import { Module, Global } from '@nestjs/common';
import { SharedService } from './shared.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseModule } from './response/response.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from './minio/minio.module';
import { PayModule } from './pay/pay.module';

@Global()
@Module({
  providers: [SharedService],
  exports: [
    SharedService,
    PrismaModule,
    ResponseModule,
    JwtModule,
    ConfigModule,
    MinioModule,
    PayModule,
  ],
  imports: [
    PrismaModule,
    ResponseModule,
    ConfigModule.forRoot({
      isGlobal: true, //全局配置
      envFilePath: '.env', //环境变量文件
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'), //秘钥
        signOptions: { expiresIn: 10 }, //10秒过期 方便测试
      }),
    }),
    MinioModule,
    PayModule,
  ],
})
export class SharedModule {}
