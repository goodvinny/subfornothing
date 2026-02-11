import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { PublicKey } from '@solana/web3.js'
import { createPaymentRequest, pollForPayment } from '@/lib/solanaPay'
import { Button } from '@/components/ui/button'
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Smartphone,
    QrCode,
    ExternalLink,
    RefreshCw,
} from 'lucide-react'

interface PaymentFlowProps {
    amount: number
    token: 'SOL' | 'USDC' | 'USDT'
    onSuccess: (signature: string) => void
    onCancel: () => void
}

type PaymentStatus = 'generating' | 'waiting' | 'confirming' | 'success' | 'error'

export default function PaymentFlow({ amount, token, onSuccess, onCancel }: PaymentFlowProps) {
    const [status, setStatus] = useState<PaymentStatus>('generating')
    const [paymentUrl, setPaymentUrl] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [signature, setSignature] = useState<string>('')
    const cleanupRef = useRef<(() => void) | null>(null)

    useEffect(() => {
        startPayment()
        return () => {
            if (cleanupRef.current) cleanupRef.current()
        }
    }, [])

    const startPayment = () => {
        try {
            setStatus('generating')
            setError('')

            const { url, reference } = createPaymentRequest(amount, token)
            setPaymentUrl(url)
            setStatus('waiting')

            // Start polling for the transaction
            const cleanup = pollForPayment(
                reference as PublicKey,
                (sig) => {
                    setSignature(sig)
                    setStatus('success')
                    onSuccess(sig)
                },
                (err) => {
                    setError(err.message)
                    setStatus('error')
                }
            )
            cleanupRef.current = cleanup
        } catch (err: any) {
            setError(err.message || 'Failed to create payment request')
            setStatus('error')
        }
    }

    const handleRetry = () => {
        if (cleanupRef.current) cleanupRef.current()
        startPayment()
    }

    const tokenColors = {
        SOL: 'text-purple-300',
        USDC: 'text-blue-300',
        USDT: 'text-emerald-300',
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Sending</p>
                <p className="text-2xl sm:text-3xl font-bold">
                    <span className={tokenColors[token]}>{amount} {token}</span>
                </p>
            </div>

            {/* Status-based content */}
            {status === 'generating' && (
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 text-violet-400 animate-spin mb-3" />
                    <p className="text-sm text-muted-foreground">Generating payment request...</p>
                </div>
            )}

            {status === 'waiting' && (
                <div className="space-y-4">
                    {/* QR Code */}
                    <div className="flex flex-col items-center">
                        <div className="relative bg-white p-4 rounded-2xl shadow-2xl shadow-violet-500/10">
                            <QRCodeSVG
                                value={paymentUrl}
                                size={220}
                                level="M"
                                includeMargin={false}
                                bgColor="#ffffff"
                                fgColor="#1a1a2e"
                            />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-violet-500/20" />
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <QrCode className="h-3.5 w-3.5 text-violet-400" />
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                                Scan with Phantom, Solflare, or any Solana wallet
                            </p>
                        </div>
                    </div>

                    {/* Mobile deep link */}
                    <a
                        href={paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <Button
                            variant="outline"
                            className="w-full border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/10 cursor-pointer gap-2 text-sm"
                        >
                            <Smartphone className="h-4 w-4" />
                            Open in Wallet App
                            <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                        </Button>
                    </a>

                    {/* Polling indicator */}
                    <div className="flex items-center justify-center gap-2 py-2">
                        <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Waiting for payment confirmation...
                        </p>
                    </div>

                    {/* Cancel */}
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className="w-full text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                    >
                        Cancel Payment
                    </Button>
                </div>
            )}

            {status === 'confirming' && (
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 text-violet-400 animate-spin mb-3" />
                    <p className="text-sm text-muted-foreground">Verifying transaction on-chain...</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-300 mb-1">Payment Confirmed!</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                        Your {amount} {token} has been verified on-chain.
                    </p>
                    {signature && (
                        <a
                            href={`https://solscan.io/tx/${signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            View on Solscan
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
                        <XCircle className="h-8 w-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-300 mb-1">Payment Failed</h3>
                    <p className="text-xs text-muted-foreground mb-4 max-w-sm">{error}</p>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleRetry}
                            variant="outline"
                            className="border-violet-500/20 hover:border-violet-500/40 cursor-pointer gap-2 text-xs"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Try Again
                        </Button>
                        <Button
                            onClick={onCancel}
                            variant="ghost"
                            className="text-muted-foreground text-xs cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Security note */}
            {status === 'waiting' && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-2.5">
                    <p className="text-[9px] sm:text-[10px] text-amber-300/70 text-center">
                        🔒 Payments are verified on the Solana blockchain. Only confirmed transactions are credited.
                    </p>
                </div>
            )}
        </div>
    )
}
