// Generated by IcedCoffeeScript 1.7.1-c
(function() {
  var C, DSA, ECDH, ECDSA, ElGamal, RSA, get_class;

  C = require('./const').openpgp.public_key_algorithms;

  RSA = require('./rsa').RSA;

  DSA = require('./dsa').DSA;

  ElGamal = require('./elgamal').ElGamal;

  ECDSA = require('./ecc/ecdsa').ECDSA;

  ECDH = require('./ecc/ecdh').ECDH;

  get_class = function(n) {
    switch (n) {
      case C.RSA:
      case C.RSA_ENCRYPT_ONLY:
      case C.RSA_SIGN_ONLY:
        return RSA;
      case C.ELGAMAL:
        return ElGamal;
      case C.DSA:
        return DSA;
      case C.ECDSA:
        return ECDSA;
      case C.ECDH:
        return ECDH;
      default:
        throw new Error("unknown public key system: " + n);
    }
  };

  module.exports = {
    get_class: get_class,
    RSA: RSA,
    DSA: DSA,
    ElGamal: ElGamal
  };

}).call(this);
