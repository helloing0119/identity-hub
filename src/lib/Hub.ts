import { Authentication } from '@decentralized-identity/did-auth-jose';
import AuthorizationController from './controllers/AuthorizationController';
import Context from './interfaces/Context';
import BaseController from './controllers/BaseController';
import BaseRequest from './models/BaseRequest';
import BaseResponse from './models/BaseResponse';
import CommitContoller from './controllers/CommitController';
import CommitQueryController from './controllers/CommitQueryController';
import ObjectQueryController from './controllers/ObjectQueryController';
import PermissionAskController from './controllers/PermissionAskController';
import PermissionGrantController from './controllers/PermissionGrantController';
import PermissionQueryController from './controllers/PermissionQueryController';
import CommitQueryRequest from './models/CommitQueryRequest';
import CommitRequest from './models/CommitRequest';
import ObjectQueryRequest from './models/ObjectQueryRequest';
import PermissionQueryRequest from './models/PermissionQueryRequest';
import PermissionGrantRequest from './models/PermissionGrantRequest';

/**
 * Core class that handles Hub requests.
 * TODO: Formalize Hub error handling then remove all references to HTTP - Hub request handling should be completely independent of HTTP.
 */
export default class Hub {
  private _controllers: {[name: string]: BaseController};
  private _authentication: Authentication;
  private _authorization: AuthorizationController;

  public constructor(private context: Context) {
    this._authentication = new Authentication({
      resolver: this.context.resolver,
      keys: this.context.keys,
      cryptoSuites: this.context.cryptoSuites
    });

    this._authorization = new AuthorizationController(this.context);

    this._controllers= {
      Commit: new CommitContoller(this.context, this._authorization),
      CommitQuery: new CommitQueryController(this.context, this._authorization),
      ObjectQuery: new ObjectQueryController(this.context, this._authorization),
      PermissionAsk: new PermissionAskController(this.context, this._authorization),
      PermissionGrant: new PermissionGrantController(this.context, this._authorization),
      PermissionQuery: new PermissionQueryController(this.context, this._authorization)
    };
  }
  public async handleRequest(request: Buffer): Promise<any> {
    let verifiedRequest;
    try {
      verifiedRequest = await this._authentication.getVerifiedRequest(request, false);
    } catch (error) {
      // TODO: Proper error logging with logger, for now logging to console.
      console.log(error);
      return {
        ok: false,
        body: Buffer.from(String(error)),
      };
    }

    if (verifiedRequest instanceof Buffer) {
      return {
        ok: true,
        body: verifiedRequest,
      };
    }
    try { 
      let response: BaseResponse;
      const requestType = BaseRequest.getTypeFromJson(verifiedRequest.request);
      switch (requestType) {
        case 'CommitQueryRequest':
          const commitQueryRequest = new CommitQueryRequest(verifiedRequest.request);
          const commitQueryController = this._controllers[requestType];
          response = await commitQueryController.handleRequest(commitQueryRequest);
          break;
          
        case 'CommitRequest':
          const commitRequest = new CommitRequest(verifiedRequest.request);
          const CommitRequestController = this._controllers[requestType];
          response = await commitQueryController.handleRequest(commitRequest);
          break;
          
        case 'ObjectQueryRequest':
          const objectQueryRequest = new ObjectQueryRequest(verifiedRequest.request);
          const objectQueryController = this._controllers[requestType];
          response = await objectQueryController.handleRequest(objectQueryRequest);
          break;
          
        case 'PermissionAskRequest':
          const permissionAskRequest = new PermissionQueryRequest(verifiedRequest.request);
          const permissionAskController = this._controllers[requestType];
          response = await permissionAskController.handleRequest(permissionAskRequest);
          break;
          
        case 'PermissionGrantRequest':
          const permissionGrantRequest = new PermissionGrantRequest(verifiedRequest.request);
          const permissionGrantController = this._controllers[requestType];
          response = await permissionGrantController.handleRequest(permissionGrantRequest);
          break;
          
        case 'PermissionQueryRequest':
          const permissionQueryRequest = new PermissionQueryRequest(verifiedRequest.request);
          const permissionQueryController = this._controllers[requestType];
          response = await permissionQueryController.handleRequest(permissionQueryRequest);
          break;
          
        default:
          throw "Bad request type";
      }

      const responseBody = response.toString();
      const responseBuffer = await this._authentication.getAuthenticatedResponse(verifiedRequest, responseBody);

      console.log(responseBody);
      return {
        ok: true,
        body: responseBuffer
      };
    }
    catch(error) {
      console.log(error);
      return {
        ok:false,
        body: Buffer.from(String(error)),
      }
    }
  }
}
