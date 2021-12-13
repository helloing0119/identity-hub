import { Injectable, Inject } from '@nestjs/common';
import Hub from './lib/Hub';

@Injectable()
export class AppService {
  constructor (@Inject('Hub') private readonly hub: Hub) {}

  async handleRequest(request: Buffer): Promise<any> {
    const response = await this.hub.handleRequest(request);
    return response;
  }
}
