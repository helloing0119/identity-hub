import { IDidResolver, DidDocument } from '@decentralized-identity/did-common-typescript';
import { CryptoFactory, JwsToken } from '@decentralized-identity/did-auth-jose';
import base64url from 'base64url';
import * as crypto from 'crypto';
import Context from '../interfaces/Context';

export default class Commit {
  protected protectedMembers: object;
  protected headerMembers: object;
  protected payloadMembers: object;
  protected signature: string;

  private originalProtected: string;
  //private originalHeader: string;
  private originalPayload: string;

  protected static resolver: IDidResolver;
  protected static cryptoFactory: CryptoFactory;

  constructor(jwt: any) {
    /**
     * Validate jwt parameter : protected
     */
    if (!('protected' in jwt)) {
      throw 'Parameter Error : protected is required';
    }
    if (typeof jwt.protected !== 'string') {
      throw 'Parameter Error : protected should be string';
    }

    this.originalProtected = jwt.protected;
    const protectedHeaders = JSON.parse(base64url.decode(this.originalProtected));

    // check required protected headers
    ['interface', 'context', 'type', 'vaultURL', 'committed_at', 'alg', 'sub', 'kid'].forEach((property) => {
      if (!(property in protectedHeaders)) {
        throw `Parameter Error : protected.${property} is required`;
      }
    });

    if (("object_id" in protectedHeaders) && !("rev" in protectedHeaders)) {
      throw "Parameter Error : protected.rev is required when protected.object_id is specified";
    }

    this.protectedMembers = protectedHeaders;

    /**
     * Validate jwt parameter : payload
     */
    if (!('payload' in jwt)) {
      throw 'Parameter Error : payload is required';
    }
    if (typeof jwt.payload !== 'string') {
      throw 'Parameter Error : payload should be string';
    }

    this.originalPayload = jwt.payload;
    this.payloadMembers = JSON.parse(base64url.decode(this.originalPayload));


    /**
     * Validate jwt parameter : (unprotected)header
     */
    const sha256 = crypto.createHash('sha256');
    sha256.update(`${this.originalProtected}.${this.originalPayload}`);
    const revision = sha256.digest('hex');


    const additionalHeaders = Object.assign({}, jwt.header);
    additionalHeaders.iss = DidDocument.getDidFromKeyId(this.protectedMembers.kid!);
    additionalHeaders.rev = revision;
    if (!("object_id" in protectedHeaders)) {
      additionalHeaders.object_id = revision;
    }

    this.headerMembers = additionalHeaders;

    /**
     * Validate jwt parameter : signature
     */
    if (!('signature' in jwt)) {
      throw "Parameter Error : signature is required";
    }

    if (typeof jwt.signature !== 'string') {
      throw "Parameter Error : signature should be string";
    }

    this.signature = jwt.signature;
  }

  getHeaderMembers(): any {
    return this.headerMembers;
  }

  getProtectedMembers(): any {
    return this.protectedMembers;
  }

  getPayloadMembers(): any {
    return this.payloadMembers;
  }

  getSignature(): string {
    return this.signature;
  }

  /**
   * 
   * @param context : context for schema
   * @returns false : not validate
   *          true : validate
   */
  async validate(context: Context): Promise<void> {
    // singleton initializer
    if (!Commit.resolver) {
      Commit.resolver = context.resolver;
    }
    if (!Commit.cryptoFactory) {
      Commit.cryptoFactory = new CryptoFactory(context.cryptoSuites);
    }
    const content = `${this.originalProtected}.${this.originalPayload}.${this.signature}`;
    const token = new JwsToken(content, Commit.cryptoFactory);
    const keyId = token.getHeader().kid;
    const senderDID = DidDocument.getDidFromKeyId(keyId);
    const senderDDO = await Commit.resolver.resolve(senderDID);
    const publicKey = senderDDO.didDocument.getPublicKey(keyId);
    if (!publicKey) {
      throw `Public Key ${keyId} could not be found`;
    }
    const jwkPublicKey = Commit.cryptoFactory.constructPublicKey(publicKey);
    await token.verifySignature(jwkPublicKey);
  }
}