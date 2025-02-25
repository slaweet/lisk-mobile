import bitcoin from 'bitcoinjs-lib';
import Lisk from '@liskhq/lisk-client';
import bip32 from 'bip32';
import config from '../../../../btc.config';

export const getSummary = params =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${config.url}/account/${params.address}`,
        config.requestOptions
      );
      const json = await response.json();
      if (response.ok) {
        resolve({
          ...params,
          balance: json.data.confirmed_balance,
          initialized: true,
        });
      } else {
        reject(json);
      }
    } catch (error) {
      reject(error);
    }
  });

export const getDerivedPathFromPassphrase = passphrase => {
  const seed = Lisk.passphrase.Mnemonic.mnemonicToSeed(passphrase);
  return bip32.fromSeed(seed, config.network).derivePath(config.derivationPath);
};

export const extractPublicKey = passphrase =>
  getDerivedPathFromPassphrase(passphrase).publicKey;

export const extractAddress = passphrase => {
  const publicKey = extractPublicKey(passphrase);
  const btc = bitcoin.payments.p2pkh({
    pubkey: publicKey,
    network: config.network,
  });
  return btc.address;
};
