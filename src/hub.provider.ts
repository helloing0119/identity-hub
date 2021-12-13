import { HttpResolver } from '@decentralized-identity/did-common-typescript';
import { EcPrivateKey } from '@decentralized-identity/did-auth-jose';

import Hub from './lib/Hub';
import Store from './lib/interfaces/Store';
import DidDocumentPublicKey from './lib/crypto/DidDocumentPublicKey';
import Context from './lib/interfaces/Context';
import { Secp256k1CryptoSuite } from './lib/crypto/Secp256k1CryptoSuite';

export const hubProvider = [
  {
    provide: "HUB",
    useFactory: async() => {
      const didDocumentKey = new DidDocumentPublicKey({
        id: "",
        type: "",
        controller: "",
        publicKeyPem: "",
        publicKeyHex: "",
        publicKeyBase64: "",
        publicKeyBase58: "",
        publicKeyMultibase: ""
      })
      const privateKey = new EcPrivateKey(didDocumentKey);
      const keys = {"kid": privateKey};
      const didServerURL = "http://146.56.161.150:8080";
      const httpResolver = new HttpResolver(didServerURL);
      const store = new Store();
      await store.init(
        "localhost",
        "postgres",
        5432,
        "username",
        "password",
        "dbname"
      );

      const context = new Context(keys, [new Secp256k1CryptoSuite()], store, httpResolver);
      const hub = new Hub(context);

      return hub;
    }
  }
];
