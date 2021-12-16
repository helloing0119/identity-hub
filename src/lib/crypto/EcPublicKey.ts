import { PublicKey } from '@decentralized-identity/did-auth-jose';
import { IDidDocumentPublicKey } from '@decentralized-identity/did-common-typescript';

/**
 * Represents an Elliptic Curve public key
 * @class
 * @extends PublicKey
 */

 enum RecommendedKeyType {
  None = '',
  Ec = 'secp256k1',
  Rsa = 'RSA',
  Oct = 'oct'
}

export default class EcPublicKey extends PublicKey {
  /** key type */
  kty = RecommendedKeyType.Ec;

  /** curve */
  crv: string;
  /** x co-ordinate */
  x: string;
  /** y co-ordinate */
  y: string;

  /**
   * An Elliptic Curve JWK
   * @param keyData The IDidDocumentPublicKey containing the elliptic curve public key parameters.
   */
  constructor (keyData: IDidDocumentPublicKey) {
    super();
    this.kid = keyData.kid;

    const data = keyData as any;

    if ('publicKeyJwk' in data) {
      const jwk = data.publicKeyJwk;
      if (!keyData.id.endsWith(jwk.kid)) {
        throw new Error('JWK kid does not match Did publickey id.');
      }
      if (!jwk.crv || !jwk.x || !jwk.y) {
        throw new Error('JWK missing required parameters.');
      }
      this.crv = jwk.crv;
      this.x = jwk.x;
      this.y = jwk.y;
      this.key_ops = jwk.key_ops;
      this.use = jwk.use;
    } else {
      throw new Error('Cannot parse Elliptic Curve key.');
    }
  }
}