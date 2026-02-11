import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { encodeURL, findReference, FindReferenceError } from '@solana/pay'
import BigNumber from 'bignumber.js'

// SPL Token mint addresses on mainnet
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')

// RPC endpoint — configurable via env. The public mainnet RPC blocks browser requests (403).
// Use a free Helius, QuickNode, or Alchemy endpoint instead.
const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
const connection = new Connection(RPC_URL, 'confirmed')

const walletAddress = import.meta.env.VITE_SOLANA_DEPOSIT_WALLET

/**
 * Creates a Solana Pay payment request URL and returns it with a unique reference.
 * 
 * @param amount - The amount to pay (in SOL for SOL, or in token units for USDC/USDT)
 * @param token - 'SOL', 'USDC', or 'USDT'
 * @returns { url, reference } — the payment URL and the reference public key for polling
 */
export function createPaymentRequest(amount: number, token: 'SOL' | 'USDC' | 'USDT') {
    if (!walletAddress || walletAddress === 'REPLACE_WITH_YOUR_SOLANA_WALLET_ADDRESS') {
        throw new Error('Deposit wallet address not configured. Set VITE_SOLANA_DEPOSIT_WALLET in .env')
    }

    const recipient = new PublicKey(walletAddress)
    const reference = Keypair.generate().publicKey
    const paymentAmount = new BigNumber(amount)

    const urlParams: {
        recipient: PublicKey
        amount: BigNumber
        reference: PublicKey
        label: string
        message: string
        splToken?: PublicKey
    } = {
        recipient,
        amount: paymentAmount,
        reference,
        label: 'SubForNothing',
        message: `Subscribe to Nothing — ${amount} ${token}`,
    }

    // For SPL tokens (USDC, USDT), add the mint address
    if (token === 'USDC') urlParams.splToken = USDC_MINT
    if (token === 'USDT') urlParams.splToken = USDT_MINT

    const url = encodeURL(urlParams)

    return { url: url.toString(), reference }
}

/**
 * Polls the Solana network for a transaction matching the given reference.
 * Returns the transaction signature when found.
 */
export function pollForPayment(
    reference: PublicKey,
    onFound: (signature: string) => void,
    onError: (error: Error) => void,
    intervalMs = 3000,
    timeoutMs = 300000 // 5 min timeout
): () => void {
    const startTime = Date.now()
    let consecutiveErrors = 0

    const poller = setInterval(async () => {
        // Timeout check
        if (Date.now() - startTime > timeoutMs) {
            clearInterval(poller)
            onError(new Error('Payment verification timed out. Please try again.'))
            return
        }

        try {
            const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' })
            clearInterval(poller)
            consecutiveErrors = 0
            onFound(signatureInfo.signature)
        } catch (error) {
            if (error instanceof FindReferenceError) {
                // Transaction not found yet — keep polling
                consecutiveErrors = 0
                return
            }
            // RPC errors (403, rate limit, network) — log and keep trying
            consecutiveErrors++
            console.warn(`[SolanaPay] Poll error (${consecutiveErrors}):`, (error as Error).message)

            // Only give up after many consecutive real errors
            if (consecutiveErrors >= 20) {
                clearInterval(poller)
                onError(new Error('Unable to connect to Solana network. Please check your RPC endpoint in .env (VITE_SOLANA_RPC_URL).'))
            }
        }
    }, intervalMs)

    // Return cleanup function
    return () => clearInterval(poller)
}

/**
 * Generates a deep link URL for mobile wallets.
 * On mobile, clicking this will open Phantom/Solflare directly.
 */
export function getWalletDeepLink(solanaPayUrl: string): string {
    // Phantom deep link
    const encodedUrl = encodeURIComponent(solanaPayUrl)
    return `https://phantom.app/ul/browse/${encodedUrl}`
}

export { connection }
