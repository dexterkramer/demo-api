import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return "Hello";
  }
}
