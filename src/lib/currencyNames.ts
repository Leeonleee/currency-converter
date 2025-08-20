import cc from "currency-codes";
import { getCryptoName } from "./crypto";


const cache: Record<string, string> = {};

export function getCurrencyDisplayName(code: string): string {
    const k = code.toUpperCase();
    if (cache[k]) return cache[k];

    const fiat = cc.code(k);
    const name = fiat?.currency ?? getCryptoName(k) ?? k;
    cache[k] = name;
    return name;
}