export const CRYPTO_DEFS = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  ADA: "Cardano",
  XRP: "XRP",
  SOL: "Solana",
  LTC: "Litecoin",
  BNB: "BNB",
  DOT: "Polkadot",
  DAI: "Dai",
  OP:  "Optimism",
  ARB: "Arbitrum",
} as const;

export type CryptoCode = keyof typeof CRYPTO_DEFS;

export const CRYPTO_CODES = new Set<Uppercase<CryptoCode>>(
    Object.keys(CRYPTO_DEFS) as Array<Uppercase<CryptoCode>>
);

export const isCrypto = (code: string) => 
    CRYPTO_CODES.has(code.toUpperCase() as Uppercase<CryptoCode>);

export const getCryptoName = (code: string) =>
    CRYPTO_DEFS[code.toUpperCase() as Uppercase<CryptoCode>];