import { Controller, Post, Body, UseGuards, Req, All } from '@nestjs/common';
import { PayService } from './pay.service';
import type { CreatePayDto } from '@en/common/pay';
import { AuthGuard } from '@libs/shared/auth/auth.guard';
import type { Request } from 'express';

@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  //创建支付订单
  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createPayDto: CreatePayDto, @Req() req: Request) {
    const user = req.user;
    return this.payService.create(createPayDto, user);
  }

  //支付宝异步回调
  @All('notify')
  notify(@Req() req: Request) {
    return this.payService.notify(req);
  }
}
