import { HttpService } from '@nestjs/axios';
import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    // this.httpService.get('http://127.0.0.1:8080/realms/demo').subscribe((res) => {
    //   console.log(res);
    // })
    return "Hello";
  }
}
