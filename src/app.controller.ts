import { Controller, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { Express } from 'express';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('Collections')
  async handleCollectionsRequest(@Req() req: Request, @Res() res: Response) {
    console.log(req.data);
    const result = await this.appService.handleRequest(Buffer.from(req.data));
    if (result.ok) { res.status(200).send(result.body.toString()); }
    else { res.status(400).send(result.body.toString()); }
  }

  @Post('Permissions')
  async handlePermissionsRequest(@Req() req: Request, @Res() res: Response) {
    console.log(req.data);
    const result = await this.appService.handleRequest(Buffer.from(req.data));
    if (result.ok) { res.status(200).send({data: result.body.toString()}); }
    else { res.status(400).send({data: result.body.toString()}); }
  }
}