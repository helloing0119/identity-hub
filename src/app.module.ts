import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { hubProvider } from './hub.provider';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';

@Module({
  imports: [ConfigModule.forRoot(), FileModule],
  controllers: [AppController],
  providers: [AppService, ...hubProvider],
})
export class AppModule {}
