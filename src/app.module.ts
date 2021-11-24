import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { objects } from './entity/objects.entity';
import { profiles } from './entity/profiles.entity';
import { collections } from './entity/collections.entity';
import { permission_requests } from './entity/permission_requests.entity';
import { permissions } from './entity/permissions.entity';


@Module({
  imports: [TypeOrmModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
