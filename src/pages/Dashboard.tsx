import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/store/useUser'
import PaymentFlow from '@/components/PaymentFlow'
import ProfileCard from '@/components/ProfileCard'
import { fetchSolPrice, MIN_USD, getMinAmount, getUsdValue } from '@/lib/solPrice'
import {
    Ban,
    Ghost,
    PartyPopper,
    LogOut,
    Bell,
    CreditCard,
    Settings,
    BarChart3,
    TrendingUp,
    AlertTriangle,
    Sparkles,
    Clock,
    Trophy,
    RefreshCw,
    Menu,
    X,
    Zap,
    Loader2,
    ExternalLink,
    Share2,
} from 'lucide-react'

const activityLog = [
    { time: 'Just now', event: 'You opened the dashboard', detail: 'Nothing happened.' },
    { time: '2 min ago', event: 'System check completed', detail: 'Everything is still nothing.' },
    { time: '1 hour ago', event: 'Feature update deployed', detail: 'No features were added.' },
    { time: '3 days ago', event: 'New roadmap published', detail: 'It was blank.' },
    { time: 'Last week', event: 'Server maintenance', detail: 'We turned nothing off and back on.' },
]

interface Transaction {
    id: string
    amount: number
    token: string
    tx_signature: string
    created_at: string
}



export default function Dashboard() {
    const navigate = useNavigate()
    const { profile, isLoggedIn, isSubscribed, isLoading, logout, recordTransaction, fetchTransactions, fetchLeaderboard } = useUser()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [showConfetti, setShowConfetti] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Send more state
    const [sendAmount, setSendAmount] = useState('')
    const [sendToken, setSendToken] = useState<'SOL' | 'USDC' | 'USDT'>('SOL')
    const [showPayment, setShowPayment] = useState(false)
    const [solPrice, setSolPrice] = useState(200)

    // Data state
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [rank, setRank] = useState(0)
    const [showProfileCard, setShowProfileCard] = useState(false)

    const totalSent = profile?.total_sent || 0
    const userName = profile?.name || 'Subscriber'

    // Redirect if not logged in or not paid
    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            navigate('/login')
        } else if (!isLoading && isLoggedIn && !isSubscribed) {
            navigate('/signup')
        }
    }, [isLoading, isLoggedIn, isSubscribed, navigate])

    // Fetch user data
    useEffect(() => {
        if (isLoggedIn) {
            loadData()
        }
    }, [isLoggedIn, profile?.total_sent])

    const loadData = async () => {
        const [txs, leaderboard] = await Promise.all([
            fetchTransactions(),
            fetchLeaderboard(),
        ])
        setTransactions(txs)

        // Calculate rank
        if (profile) {
            const idx = leaderboard.findIndex((e) => e.id === profile.id)
            setRank(idx >= 0 ? idx + 1 : leaderboard.length + 1)
        }
    }

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => setShowConfetti(false), 4000)
        return () => clearTimeout(timeout)
    }, [])

    const handlePaymentSuccess = async (signature: string) => {
        const amount = parseFloat(sendAmount)
        // Record the USD value, not the token amount
        const usdAmount = getUsdValue(amount, sendToken, solPrice)
        const result = await recordTransaction(usdAmount, sendToken, signature)
        if (!result.error) {
            setSendAmount('')
            setShowPayment(false)
            await loadData()
        }
    }

    // Fetch SOL price
    useEffect(() => {
        fetchSolPrice().then(setSolPrice)
    }, [])

    const minAmount = getMinAmount(sendToken, solPrice)
    const parsedAmount = parseFloat(sendAmount) || 0
    const usdValue = getUsdValue(parsedAmount, sendToken, solPrice)
    const isAmountValid = parsedAmount >= minAmount

    // Build dynamic activity log
    const dynamicActivity = [
        ...transactions.slice(0, 3).map((tx) => ({
            time: new Date(tx.created_at).toLocaleDateString(),
            event: `Sent ${tx.amount} ${tx.token}`,
            detail: `Tx: ${tx.tx_signature.slice(0, 8)}...${tx.tx_signature.slice(-6)}`,
            link: `https://solscan.io/tx/${tx.tx_signature}`,
        })),
        ...activityLog.map((a) => ({ ...a, link: '' })),
    ]

    const emptyStats = [
        { label: 'Features Used', value: '0', icon: BarChart3, change: '0% from last lifetime' },
        { label: 'Total Wasted', value: totalSent > 0 ? `$${totalSent.toLocaleString()}` : '$0', icon: TrendingUp, change: totalSent > 0 ? 'Gone forever' : 'Nothing yet' },
        { label: 'Support Tickets', value: '0', icon: AlertTriangle, change: "Can't file what doesn't exist" },
        { label: 'Leaderboard Rank', value: rank > 0 ? `#${rank}` : '—', icon: Trophy, change: rank > 0 && rank <= 10 ? 'Top 10! Incredible waste' : 'Send more to climb' },
    ]

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
            </div>
        )
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <div className="min-h-screen">
            {/* Dashboard Navbar */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25 flex-shrink-0">
                            <Ban className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xs sm:text-sm font-bold tracking-tight">
                                Sub<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">ForNothing</span>
                            </span>
                            <p className="text-[8px] sm:text-[10px] text-muted-foreground -mt-0.5">Dashboard</p>
                        </div>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Link to="/leaderboard">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-yellow-400 cursor-pointer gap-1.5">
                                <Trophy className="h-3.5 w-3.5" />
                                Leaderboard
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground cursor-pointer">
                            <Bell className="h-4 w-4" />
                            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-violet-500 text-[8px] text-white font-bold">
                                0
                            </span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground cursor-pointer">
                            <Settings className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
                        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2 cursor-pointer">
                            <LogOut className="h-4 w-4" />
                            Log Out
                        </Button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all cursor-pointer"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl animate-fade-in">
                        <div className="flex flex-col gap-1 p-3">
                            <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer text-muted-foreground hover:text-yellow-400">
                                    <Trophy className="h-4 w-4" />
                                    Leaderboard
                                </Button>
                            </Link>
                            <Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer text-muted-foreground">
                                <Bell className="h-4 w-4" />
                                Notifications (0)
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer text-muted-foreground">
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                            <Separator className="bg-white/5 my-1" />
                            <Button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} variant="ghost" className="w-full justify-start gap-2 cursor-pointer text-muted-foreground hover:text-red-400">
                                <LogOut className="h-4 w-4" />
                                Log Out
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
                {/* Welcome Banner */}
                <div className="relative mb-6 sm:mb-10 overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 bg-gradient-to-br from-violet-600/10 via-fuchsia-600/5 to-transparent p-5 sm:p-8">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 right-0 h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] rounded-full bg-violet-600/20 blur-[80px]" />
                        <div className="absolute bottom-0 left-1/3 h-[100px] w-[100px] sm:h-[150px] sm:w-[150px] rounded-full bg-fuchsia-600/15 blur-[60px]" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                {showConfetti && <PartyPopper className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 animate-bounce" />}
                                <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
                                    Hey {userName},{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                        welcome back!
                                    </span>
                                </h1>
                            </div>
                            <p className="text-xs sm:text-base text-muted-foreground max-w-lg leading-relaxed">
                                {totalSent > 0
                                    ? `You've wasted $${totalSent.toLocaleString()} so far. ${rank > 0 ? `You're rank #${rank} on the leaderboard.` : ''} Keep sending to climb higher!`
                                    : "Your lifetime subscription is active! Send some funds to get on the leaderboard."}
                            </p>
                        </div>
                        <Badge className="flex-shrink-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1.5 sm:px-4 sm:py-2 w-fit text-xs">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Lifetime Active
                        </Badge>
                        <Button
                            onClick={() => setShowProfileCard(true)}
                            variant="outline"
                            className="flex-shrink-0 border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/10 cursor-pointer gap-2 text-xs px-3 py-1.5 sm:px-4 sm:py-2 w-fit"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            Share Card
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
                    {emptyStats.map((stat, index) => (
                        <Card
                            key={index}
                            className="border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-violet-500/10 hover:bg-white/[0.04]"
                        >
                            <CardContent className="p-3 sm:p-5">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <p className="text-[9px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                    <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/50" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold mb-0.5 sm:mb-1">{stat.value}</p>
                                <p className="text-[9px] sm:text-xs text-muted-foreground">{stat.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">

                        {/* ⚡ SEND MORE FUNDS CARD */}
                        <Card className="border-violet-500/20 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 backdrop-blur-sm overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500" />
                            <CardHeader className="pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                                    Send More Funds
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Pay with Solana Pay — scan the QR code with Phantom or any Solana wallet.
                                    {rank > 0 && ` You're currently rank #${rank}.`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!showPayment ? (
                                    <>
                                        {/* Amount + Token */}
                                        <div className="space-y-2">
                                            <Label className="text-xs sm:text-sm">Amount to send</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    min={minAmount}
                                                    step="any"
                                                    placeholder={String(minAmount)}
                                                    value={sendAmount}
                                                    onChange={(e) => setSendAmount(e.target.value)}
                                                    className="h-10 sm:h-11 text-sm border-white/10 bg-white/[0.03] placeholder:text-muted-foreground/50 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30 transition-all flex-1 min-w-0"
                                                />
                                                <div className="flex gap-1 flex-shrink-0">
                                                    {(['SOL', 'USDC', 'USDT'] as const).map((token) => (
                                                        <button
                                                            key={token}
                                                            type="button"
                                                            onClick={() => { setSendToken(token); setSendAmount('') }}
                                                            className={`px-2 sm:px-3 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all cursor-pointer ${sendToken === token
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
                                            <div className="flex justify-between">
                                                <p className="text-[9px] sm:text-[10px] text-muted-foreground/60">
                                                    Min: {minAmount} {sendToken} (${MIN_USD})
                                                </p>
                                                {parsedAmount > 0 && (
                                                    <p className="text-[9px] sm:text-[10px] text-muted-foreground/60">
                                                        ≈ ${usdValue.toFixed(2)} USD
                                                    </p>
                                                )}
                                            </div>
                                            {parsedAmount > 0 && !isAmountValid && (
                                                <p className="text-[10px] text-red-400">Minimum ${MIN_USD} required ({minAmount} {sendToken}).</p>
                                            )}
                                        </div>

                                        {/* Generate QR button */}
                                        <Button
                                            onClick={() => setShowPayment(true)}
                                            disabled={!sendAmount || !isAmountValid}
                                            className="w-full h-10 sm:h-11 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 cursor-pointer disabled:opacity-50 text-sm"
                                        >
                                            <Zap className="mr-2 h-4 w-4" />
                                            Generate Payment QR
                                        </Button>

                                        <p className="text-[9px] sm:text-[10px] text-center text-muted-foreground">
                                            Payments are verified on the Solana blockchain. Only confirmed transactions are credited.
                                        </p>
                                    </>
                                ) : (
                                    <PaymentFlow
                                        amount={parsedAmount}
                                        token={sendToken}
                                        onSuccess={handlePaymentSuccess}
                                        onCancel={() => setShowPayment(false)}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        {/* Empty Content Card */}
                        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
                            <CardHeader className="pb-2 sm:pb-4">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Ghost className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                                    Your Content
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Everything you've unlocked with your lifetime subscription
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
                                    <div className="mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 ring-1 ring-violet-500/10">
                                        <Ghost className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400/50" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2">It's beautifully empty</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-4 sm:mb-6 leading-relaxed px-4">
                                        This is where your features would be. If we had any.
                                        Which we don't. And probably won't. But hey, the dashboard looks nice!
                                    </p>
                                    <Badge variant="outline" className="border-violet-500/20 text-violet-300 bg-violet-500/5 text-[10px] sm:text-xs px-2">
                                        <Sparkles className="mr-1 sm:mr-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                        Features may be implemented. But probably mostly nothing.
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Log */}
                        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
                            <CardHeader className="pb-2 sm:pb-4">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                                    Activity Log
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    A detailed record of all the nothing that's happened
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 sm:space-y-4">
                                    {dynamicActivity.slice(0, 8).map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-white/5 last:border-0 last:pb-0"
                                        >
                                            <div className="flex-shrink-0 mt-1.5">
                                                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-violet-400/50" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-0.5">
                                                    <p className="text-xs sm:text-sm font-medium">{activity.event}</p>
                                                    <span className="text-[9px] sm:text-[10px] text-muted-foreground flex-shrink-0">
                                                        {activity.time}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground">{activity.detail}</p>
                                                    {activity.link && (
                                                        <a href={activity.link} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">
                                                            <ExternalLink className="h-2.5 w-2.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Subscription Card */}
                        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
                            <CardHeader className="pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                                    Subscription
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                <div className="rounded-xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 ring-1 ring-violet-500/10 p-3 sm:p-4">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <span className="text-xs sm:text-sm font-medium">The Nothing Plan</span>
                                        <Badge className={`${profile?.has_paid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} text-[9px] sm:text-[10px]`}>
                                            {profile?.has_paid ? 'Lifetime' : 'Unpaid'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                            ${totalSent.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">USD total sent</span>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
                                        {transactions.length} verified transaction{transactions.length !== 1 ? 's' : ''} on-chain
                                    </p>
                                </div>

                                <Separator className="bg-white/5" />

                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className={`${profile?.has_paid ? 'text-emerald-400' : 'text-red-400'} font-medium`}>
                                            {profile?.has_paid ? 'Lifetime Active' : 'Not Active'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Value received</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Money wasted</span>
                                        <span className="text-red-400 font-medium">${totalSent.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">ROI</span>
                                        <span className="text-red-400 font-medium">{totalSent > 0 ? '-100%' : '0%'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Leaderboard rank</span>
                                        <Link to="/leaderboard" className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-1 transition-colors">
                                            {rank > 0 ? `#${rank}` : '—'} <Trophy className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>

                                <Separator className="bg-white/5" />

                                {/* Don't forget to resubscribe */}
                                <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-2.5 sm:p-3">
                                    <div className="flex gap-2">
                                        <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-medium text-amber-300">Don't forget!</p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                                                Don't forget to resubscribe every lifetime. The nothing isn't going to pay for itself.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Send more to climb */}
                                <div className="rounded-lg bg-violet-500/5 border border-violet-500/10 p-2.5 sm:p-3">
                                    <div className="flex gap-2">
                                        <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] sm:text-xs font-medium text-violet-300">Climb the ranks!</p>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                                                Send more SOL, USDC, or USDT to climb the leaderboard.{rank > 0 ? ` You're currently #${rank}.` : ''} {rank > 10 ? 'Embarrassing.' : rank > 0 ? 'Impressive waste!' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 transition-all cursor-pointer text-xs sm:text-sm"
                                >
                                    Cancel Subscription (Why would you?)
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Live Clock Card */}
                        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
                            <CardHeader className="pb-2 sm:pb-3">
                                <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-400" />
                                    Time Wasted Today
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-3 sm:py-4">
                                    <p className="text-2xl sm:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                        {currentTime.toLocaleTimeString()}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                                        Every second on this page is a second you'll never get back
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Features */}
                        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
                            <CardHeader className="pb-2 sm:pb-3">
                                <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-400" />
                                    Upcoming Features
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 sm:space-y-3">
                                    {[
                                        { feature: 'More nothing', eta: 'Q1 2027' },
                                        { feature: 'Advanced nothing', eta: 'Q3 2027' },
                                        { feature: 'Nothing 2.0', eta: 'Eventually™' },
                                        { feature: 'Something (jk)', eta: 'Never' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <span className="text-[10px] sm:text-xs text-muted-foreground">{item.feature}</span>
                                            <Badge variant="outline" className="text-[8px] sm:text-[10px] border-white/10 text-muted-foreground">
                                                {item.eta}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Profile Share Card Modal */}
            {showProfileCard && (
                <ProfileCard
                    name={userName}
                    totalWasted={totalSent}
                    rank={rank}
                    txCount={transactions.length}
                    memberSince={profile?.created_at || new Date().toISOString()}
                    onClose={() => setShowProfileCard(false)}
                />
            )}
        </div>
    )
}
