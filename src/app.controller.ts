import { Controller, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('Collections')
  async handleCollectionsRequest(@Req() req: Request, @Res() res: Response) {
    const result = await this.appService.handleRequest(Buffer.from(req.body));
    if (result.ok) { res.status(200).send(result.body.toString()); }
    else { res.status(400).send(result.body.toString()); }
  }

  @Post('Permissions')
  async handlePermissionsRequest(@Req() req: Request, @Res() res: Response) {
    const result = await this.appService.handleRequest(Buffer.from(req.body));
    if (result.ok) { res.status(200).send(result.body.toString()); }
    else { res.status(400).send(result.body.toString()); }
  }
}