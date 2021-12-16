import { HttpResolver } from '@decentralized-identity/did-common-typescript';
import Hub from './lib/Hub';
import Store from './lib/interfaces/Store';
import Context from './lib/interfaces/Context';
import { Secp256k1CryptoSuite } from './lib/crypto/Secp256k1CryptoSuite';

export const hubProvider = [
  {
    provide: "HUB",
    useFactory: async() => {
      const keys = {"kid": "PUB_K1_6oKhayVuCEwiqeGN1PP4bpyh7Pbe3sqeWmaRyWs1wSA4NXWehb"};
      const didServerURL = "http://146.56.161.150:8080";
      const httpResolver = new HttpResolver(didServerURL);
      const store = new Store();
      await store.init(
        "localhost",
        "postgres",
        5432,
        "username",
        "password",
        "blockerDB"
      );

      const context = new Context(keys, [new Secp256k1CryptoSuite()], store, httpResolver);
      const hub = new Hub(context);

      return hub;
    }
  }
];
