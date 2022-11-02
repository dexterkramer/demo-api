import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    return "Hello";
  }
}
