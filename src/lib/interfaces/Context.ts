import { CryptoSuite, PrivateKey } from '@decentralized-identity/did-auth-jose';
import { IDidResolver } from '@decentralized-identity/did-common-typescript';
import Store from './Store';


export default class Context {
  constructor(keys: any, cryptoSuites: CryptoSuite[], store: Store, resolver: IDidResolver) {
    this.keys = keys;
    this.cryptoSuites = cryptoSuites;
    this.store = store;
    this.resolver = resolver;
  }
  
  public keys: { [name: string]: PrivateKey };
  public cryptoSuites: CryptoSuite[];
  public store: Store;
  public resolver: IDidResolver;
}
