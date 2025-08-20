import cc from "currency-codes";

const CRYPTO_NAME_MAP: Record<string, string> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    ADA: "Cardano",
    XRP: "XRP",
    SOL: "Solana",
    LTC: "Litecoin",
    BNB: "BNB",
    DOT: "Polkadot",
    DAI: "Dai",
    OP: "Optimism",
    ARB: "Arbitrum",
}

const cache: Record<string, string> = {};

export function getCurrencyDisplayName(code: string): string {
    const k = code.toUpperCase();
    if (cache[k]) return cache[k];

    const fiat = cc.code(k);
    const name =
        fiat?.currency ??
        CRYPTO_NAME_MAP[k] ??
        k;
    cache[k] = name;
    return name;
}