/**
 * Fetches the current SOL/USD price from multiple APIs with fallback.
 * Tries Coinbase first (most reliable from browser), then CoinGecko.
 */

const FALLBACK_SOL_PRICE = 200

export async function fetchSolPrice(): Promise<number> {
    // Try Coinbase first — no API key, CORS-friendly, very reliable
    try {
        const res = await fetch('https://api.coinbase.com/v2/prices/SOL-USD/spot')
        if (res.ok) {
            const data = await res.json()
            const price = parseFloat(data?.data?.amount)
            if (price && price > 0) return price
        }
    } catch {
        // Coinbase failed, try next
    }

    // Try CoinGecko as backup
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        if (res.ok) {
            const data = await res.json()
            const price = data?.solana?.usd
            if (price && price > 0) return price
        }
    } catch {
        // CoinGecko also failed
    }

    console.warn('[solPrice] All price APIs failed, using fallback:', FALLBACK_SOL_PRICE)
    return FALLBACK_SOL_PRICE
}

export const MIN_USD = 10 // Minimum $10

export function getMinAmount(token: 'SOL' | 'USDC' | 'USDT', solPrice: number): number {
    if (token === 'USDC' || token === 'USDT') return MIN_USD // $1 = 1 USDC/USDT
    // For SOL: $10 / SOL price, rounded up to 4 decimals
    return Math.ceil((MIN_USD / solPrice) * 10000) / 10000
}

export function getUsdValue(amount: number, token: 'SOL' | 'USDC' | 'USDT', solPrice: number): number {
    if (token === 'USDC' || token === 'USDT') return amount
    return amount * solPrice
}
