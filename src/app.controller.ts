import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async getPermission(grantee: string): Promise<string> {
    return this.appService.getPermission(grantee);
  }
}
