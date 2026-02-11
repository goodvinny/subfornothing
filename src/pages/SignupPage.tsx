import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/store/useUser'
import PaymentFlow from '@/components/PaymentFlow'
import { fetchSolPrice, MIN_USD, getMinAmount, getUsdValue } from '@/lib/solPrice'
import {
    Ban,
    Eye,
    EyeOff,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Trophy,
    AlertCircle,
} from 'lucide-react'



export default function SignupPage() {
    const navigate = useNavigate()
    const { signup, recordTransaction, isLoggedIn, isSubscribed } = useUser()

    // Form state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [selectedToken, setSelectedToken] = useState<'SOL' | 'USDC' | 'USDT'>('SOL')
    const [amount, setAmount] = useState('')
    const [solPrice, setSolPrice] = useState(200)

    // Flow state
    const [step, setStep] = useState<'form' | 'payment' | 'complete'>('form')
    const [isSigningUp, setIsSigningUp] = useState(false)
    const [error, setError] = useState('')

    // Fetch SOL price on mount
    useEffect(() => {
        fetchSolPrice().then((price) => {
            setSolPrice(price)
        })
    }, [])

    // Update default amount when token changes
    useEffect(() => {
        const min = getMinAmount(selectedToken, solPrice)
        setAmount(String(min))
    }, [selectedToken, solPrice])

    const parsedAmount = parseFloat(amount) || 0
    const minAmount = getMinAmount(selectedToken, solPrice)
    const usdValue = getUsdValue(parsedAmount, selectedToken, solPrice)
    const isAmountValid = parsedAmount >= minAmount

    // Step 1: Create the account
    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!isAmountValid) {
            setError(`Minimum amount is $${MIN_USD} (${minAmount} ${selectedToken}).`)
            return
        }

        setIsSigningUp(true)

        const result = await signup(name, email, password)

        if (result.error) {
            setError(result.error)
            setIsSigningUp(false)
            return
        }

        setIsSigningUp(false)
        setStep('payment')
    }

    // Step 2: Payment confirmed on-chain
    const handlePaymentSuccess = async (signature: string) => {
        // Record the USD value, not the token amount
        const usdAmount = getUsdValue(parsedAmount, selectedToken, solPrice)
        const result = await recordTransaction(usdAmount, selectedToken, signature)
        if (result.error) {
            setError(result.error)
            return
        }
        setStep('complete')
        setTimeout(() => navigate('/dashboard'), 2000)
    }

    // If already subscribed (paid), redirect
    if (isSubscribed && step === 'form') {
        return (
            <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 py-8">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Already subscribed!</h2>
                    <p className="text-sm text-muted-foreground mb-4">You already have an account and have paid.</p>
                    <Link to="/dashboard">
                        <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white cursor-pointer">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // If logged in but NOT paid, go straight to payment
    if (isLoggedIn && !isSubscribed && step === 'form') {
        return (
            <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 py-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-violet-600/15 blur-[120px] animate-pulse" />
                </div>
                <div className="relative z-10 w-full max-w-md">
                    <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-violet-500/5">
                        <CardHeader className="text-center pb-2 px-4 sm:px-6">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25">
                                <Ban className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-xl sm:text-2xl font-bold">Complete Payment</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Your account exists but you haven't paid yet. Complete payment below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                            {/* Token selector */}
                            <div className="space-y-2 mb-4">
                                <Label className="text-xs sm:text-sm font-medium">Token</Label>
                                <div className="flex gap-1">
                                    {(['SOL', 'USDC', 'USDT'] as const).map((token) => (
                                        <button
                                            key={token}
                                            type="button"
                                            onClick={() => setSelectedToken(token)}
                                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedToken === token
                                                ? token === 'SOL'
                                                    ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30'
                                                    : token === 'USDC'
                                                        ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30'
                                                        : 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                                                : 'bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]'
                                                }`}
                                        >
                                            {token}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="space-y-2 mb-4">
                                <Label className="text-xs sm:text-sm font-medium">Amount ({selectedToken})</Label>
                                <Input
                                    type="number"
                                    min={minAmount}
                                    step="any"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-10 text-sm border-white/10 bg-white/[0.03]"
                                />
                                <div className="flex justify-between">
                                    <p className="text-[10px] text-muted-foreground">
                                        Min: {minAmount} {selectedToken} (${MIN_USD})
                                    </p>
                                    {parsedAmount > 0 && (
                                        <p className="text-[10px] text-muted-foreground">
                                            ≈ ${usdValue.toFixed(2)} USD
                                        </p>
                                    )}
                                </div>
                                {parsedAmount > 0 && !isAmountValid && (
                                    <p className="text-[10px] text-red-400">Minimum ${MIN_USD} required.</p>
                                )}
                            </div>

                            {isAmountValid && (
                                <PaymentFlow
                                    amount={parsedAmount}
                                    token={selectedToken}
                                    onSuccess={handlePaymentSuccess}
                                    onCancel={() => navigate('/')}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 right-1/4 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-violet-600/15 blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 h-[200px] w-[200px] sm:h-[350px] sm:w-[350px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-pulse [animation-delay:1s]" />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative z-10 w-full max-w-md">
                <Link
                    to="/"
                    className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
                    Back to nothing
                </Link>

                <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-violet-500/5">
                    <CardHeader className="text-center pb-2 px-4 sm:px-6">
                        <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25">
                            <Ban className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <CardTitle className="text-xl sm:text-2xl font-bold">
                            {step === 'form' && 'Subscribe to Nothing'}
                            {step === 'payment' && 'Complete Payment'}
                            {step === 'complete' && 'Welcome to Nothing!'}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                            {step === 'form' && 'Create your account, then pay with SOL, USDC, or USDT'}
                            {step === 'payment' && `Scan the QR code to send ${parsedAmount} ${selectedToken}`}
                            {step === 'complete' && 'Your payment has been verified on-chain'}
                        </CardDescription>

                        {/* Step indicator */}
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <div className={`h-1.5 rounded-full transition-all ${step === 'form' ? 'w-8 bg-violet-500' : 'w-4 bg-violet-500/30'}`} />
                            <div className={`h-1.5 rounded-full transition-all ${step === 'payment' ? 'w-8 bg-violet-500' : step === 'complete' ? 'w-4 bg-violet-500/30' : 'w-4 bg-white/10'}`} />
                            <div className={`h-1.5 rounded-full transition-all ${step === 'complete' ? 'w-8 bg-emerald-500' : 'w-4 bg-white/10'}`} />
                        </div>
                    </CardHeader>

                    <CardContent className="px-4 sm:px-6">
                        {/* Error display */}
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-300">{error}</p>
                            </div>
                        )}

                        {/* STEP 1: Account Creation Form */}
                        {step === 'form' && (
                            <form onSubmit={handleCreateAccount} className="space-y-4 sm:space-y-5">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="name" className="text-xs sm:text-sm font-medium">Display Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="CryptoWhale.sol"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="h-10 sm:h-11 text-sm border-white/10 bg-white/[0.03] placeholder:text-muted-foreground/50 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30"
                                    />
                                    <p className="text-[9px] sm:text-[10px] text-muted-foreground/60">
                                        This is how you'll appear on the leaderboard of shame.
                                    </p>
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="sucker@money.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-10 sm:h-11 text-sm border-white/10 bg-white/[0.03] placeholder:text-muted-foreground/50 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30"
                                    />
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className="h-10 sm:h-11 text-sm pr-10 border-white/10 bg-white/[0.03] placeholder:text-muted-foreground/50 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Separator className="bg-white/5" />

                                {/* Token selector */}
                                <div className="space-y-2 sm:space-y-3">
                                    <Label className="text-xs sm:text-sm font-medium">Payment Token</Label>
                                    <div className="flex gap-1">
                                        {(['SOL', 'USDC', 'USDT'] as const).map((token) => (
                                            <button
                                                key={token}
                                                type="button"
                                                onClick={() => setSelectedToken(token)}
                                                className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedToken === token
                                                    ? token === 'SOL'
                                                        ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30'
                                                        : token === 'USDC'
                                                            ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30'
                                                            : 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                                                    : 'bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]'
                                                    }`}
                                            >
                                                {token}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment amount */}
                                <div className="space-y-2 sm:space-y-3">
                                    <Label className="text-xs sm:text-sm font-medium">Amount ({selectedToken})</Label>
                                    <Input
                                        type="number"
                                        min={minAmount}
                                        step="any"
                                        placeholder={String(minAmount)}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="h-10 sm:h-11 text-sm border-white/10 bg-white/[0.03] placeholder:text-muted-foreground/50 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30"
                                    />
                                    <div className="flex justify-between items-center">
                                        <p className="text-[9px] sm:text-[10px] text-muted-foreground/60">
                                            Min: {minAmount} {selectedToken} (${MIN_USD})
                                        </p>
                                        {parsedAmount > 0 && (
                                            <p className="text-[9px] sm:text-[10px] text-muted-foreground/60">
                                                ≈ ${usdValue.toFixed(2)} USD
                                            </p>
                                        )}
                                    </div>
                                    {parsedAmount > 0 && !isAmountValid && (
                                        <p className="text-[10px] text-red-400">Minimum ${MIN_USD} required ({minAmount} {selectedToken}).</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSigningUp || !isAmountValid}
                                    className="w-full h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 cursor-pointer disabled:opacity-50"
                                >
                                    {isSigningUp ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        `Create Account & Pay ${isAmountValid ? '$' + usdValue.toFixed(2) : ''}`
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* STEP 2: Solana Pay QR */}
                        {step === 'payment' && (
                            <PaymentFlow
                                amount={parsedAmount}
                                token={selectedToken}
                                onSuccess={handlePaymentSuccess}
                                onCancel={() => setStep('form')}
                            />
                        )}

                        {/* STEP 3: Complete */}
                        {step === 'complete' && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">You're in!</h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Welcome to the Nothing community. Redirecting to your dashboard...
                                </p>
                                <Loader2 className="h-5 w-5 text-violet-400 animate-spin" />
                            </div>
                        )}

                        {step === 'form' && (
                            <>
                                <Separator className="my-4 sm:my-6 bg-white/5" />

                                <div className="space-y-2 sm:space-y-3">
                                    <p className="text-[9px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">What you'll receive:</p>
                                    {[
                                        'A lifetime of absolutely nothing',
                                        'Your name on the leaderboard of shame',
                                        'Existential contemplation — forever',
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-violet-400 flex-shrink-0" />
                                            <span className="text-[10px] sm:text-xs text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4 sm:my-6 bg-white/5" />

                                <div className="flex items-center justify-between">
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Already subscribed?{' '}
                                        <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
                                            Log in
                                        </Link>
                                    </p>
                                    <Link to="/leaderboard" className="text-[10px] sm:text-xs text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
                                        <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                        Leaderboard
                                    </Link>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <p className="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs text-muted-foreground/50 px-4">
                    By signing up, you agree to our Terms of Nothing and acknowledge that you're bad with money.
                </p>
            </div>
        </div>
    )
}
