import { Authentication } from '@decentralized-identity/did-auth-jose';
import Context from './interfaces/Context';

/**
 * Core class that handles Hub requests.
 * TODO: Formalize Hub error handling then remove all references to HTTP - Hub request handling should be completely independent of HTTP.
 */
export default class Hub {
  public async handleRequest(request: any): Promise<any> {
  }
}
