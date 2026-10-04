import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '@libs/shared/minio/minio.module';
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule, MinioModule],
})
export class UserModule {}
