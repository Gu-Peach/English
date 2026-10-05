import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { AuthGuard } from '@libs/shared/auth/auth.guard';
import type { Request } from 'express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('list')
  findAll() {
    return this.courseService.findAll();
  }

  //获取我购买的课程
  @UseGuards(AuthGuard)
  @Get('my')
  findMy(@Req() req: Request) {
    const user = req.user;
    return this.courseService.findMy(user.userId);
  }
}
