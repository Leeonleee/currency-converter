export function convert(amount: number, from: string, to: string, rates: Record<string, number>) {
    const rFrom = rates[from];
    const rTo = rates[to];
    if (!rFrom || !rTo) {
        return NaN;
    }
    return amount * (rTo / rFrom);
}