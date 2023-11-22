import { Controller, Get, UseGuards, Request, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    return "Hello";
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
