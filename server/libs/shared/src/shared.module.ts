import { Module, Global } from '@nestjs/common';
import { SharedService } from './shared.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResponseModule } from './response/response.module';
@Global() // 全局模块，可以在任何地方注入
@Module({
  providers: [SharedService],
  exports: [SharedService, PrismaModule, ResponseModule],
  imports: [PrismaModule, ResponseModule],
})
export class SharedModule {}
