import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('file')
export class FileController {
    constructor(private config: ConfigService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(@UploadedFile() file) {
        const path = file.path.replace(this.config.get('ATTACH_SAVE_PATH'), '');
        console.log(path.replace(/\\/gi, '/'));
        return {
            fileName: file.originalname,
            savedPath: path.replace(/\\/gi, '/'),
            size: file.size,
        };
    }

    @Get(':path/:name')
    async download(@Res() res: Response, @Param('path') path: string, @Param('name') name: string, @Query('fn') fileName) {
        res.download(`${this.config.get('ATTACH_SAVE_PATH')}/${path}/${name}`, fileName);
    }
}