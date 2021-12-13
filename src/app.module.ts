import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { hubProvider } from './hub.provider';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ...hubProvider],
})
export class AppModule {}
