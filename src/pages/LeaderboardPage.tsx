import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Navbar from '@/components/Navbar'
import { useUser } from '@/store/useUser'
import {
    Ban,
    Trophy,
    Crown,
    Medal,
    ArrowLeft,
    Flame,
    TrendingUp,
    User,
    Loader2,
} from 'lucide-react'



interface LeaderboardEntry {
    rank: number
    name: string
    total_sent: number
    id: string
    isUser?: boolean
}

function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
    if (rank === 2) return <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
    if (rank === 3) return <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
    return <span className="text-xs sm:text-sm font-mono text-muted-foreground">#{rank}</span>
}

function getRankBg(rank: number, isUser: boolean) {
    if (isUser) return 'bg-gradient-to-r from-violet-500/15 to-fuchsia-500/10 border-violet-500/30'
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-yellow-500/20'
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/10 to-gray-500/5 border-gray-400/20'
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/10 to-orange-600/5 border-amber-600/20'
    return 'border-white/5 hover:border-violet-500/10'
}

export default function LeaderboardPage() {
    const [loading, setLoading] = useState(true)
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
    const { profile, fetchLeaderboard } = useUser()

    useEffect(() => {
        loadLeaderboard()
    }, [])

    const loadLeaderboard = async () => {
        setLoading(true)
        const data = await fetchLeaderboard()
        const ranked = data.map((entry, i) => ({
            ...entry,
            rank: i + 1,
            isUser: profile ? entry.id === profile.id : false,
        }))
        setLeaderboardData(ranked)
        setLoading(false)
    }



    const totalWasted = leaderboardData.reduce((sum, entry) => sum + Number(entry.total_sent), 0)

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <Link
                        to="/"
                        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
                        Back to nothing
                    </Link>

                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 ring-1 ring-yellow-500/20">
                            <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4">
                        Hall of{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
                            Wasted Funds
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                        The top 50 legends who have thrown away the most money on absolutely nothing.
                        Climb the ranks by sending more. Your parents would be so proud.
                    </p>

                    {/* Stats Bar */}
                    <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
                        <div className="text-center">
                            <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                {totalWasted > 0 ? '$' + totalWasted.toLocaleString() : '$0'}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Total Wasted</p>
                        </div>
                        <Separator orientation="vertical" className="h-8 sm:h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-lg sm:text-2xl font-bold">{leaderboardData.length}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Wasters</p>
                        </div>
                        <Separator orientation="vertical" className="h-8 sm:h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                                {leaderboardData[0]?.total_sent ? '$' + Number(leaderboardData[0].total_sent).toLocaleString() : '$0'}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">#1 Biggest Waster</p>
                        </div>
                    </div>


                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 text-violet-400 animate-spin mb-4" />
                        <p className="text-sm text-muted-foreground">Loading the hall of shame...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && leaderboardData.length === 0 && (
                    <div className="text-center py-20">
                        <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No wasters yet!</h3>
                        <p className="text-sm text-muted-foreground mb-6">Be the first to subscribe to nothing.</p>
                        <Link to="/signup">
                            <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white cursor-pointer">
                                Be #1 on the Leaderboard
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Top 3 Podium */}
                {!loading && leaderboardData.length >= 3 && (
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        {/* 2nd Place */}
                        <div className="mt-6 sm:mt-8">
                            <Card className={`${leaderboardData[1]?.isUser ? 'border-violet-500/30 ring-1 ring-violet-500/20' : 'border-gray-400/20'} bg-gradient-to-b from-gray-400/10 to-transparent backdrop-blur-sm text-center overflow-hidden`}>
                                <div className="h-0.5 sm:h-1 bg-gradient-to-r from-gray-300 to-gray-500" />
                                <CardContent className="p-2 sm:p-4 pt-3 sm:pt-5">
                                    {leaderboardData[1]?.isUser ? (
                                        <User className="h-6 w-6 sm:h-8 sm:w-8 text-violet-400 mx-auto mb-1 sm:mb-2" />
                                    ) : (
                                        <Medal className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-1 sm:mb-2" />
                                    )}
                                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">#2</p>
                                    <p className={`font-bold text-[10px] sm:text-sm truncate mb-0.5 sm:mb-1 ${leaderboardData[1]?.isUser ? 'text-violet-300' : ''}`}>
                                        {leaderboardData[1]?.isUser ? '⭐ ' : ''}{leaderboardData[1]?.name}
                                    </p>
                                    <p className="text-sm sm:text-lg font-bold text-gray-300">${Number(leaderboardData[1]?.total_sent).toLocaleString()}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 1st Place */}
                        <div>
                            <Card className={`${leaderboardData[0]?.isUser ? 'border-violet-500/30 ring-1 ring-violet-500/20' : 'border-yellow-500/20'} bg-gradient-to-b from-yellow-500/15 to-transparent backdrop-blur-sm text-center overflow-hidden relative`}>
                                <div className="h-1 sm:h-1.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />
                                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
                                <CardContent className="p-2 sm:p-4 pt-3 sm:pt-5 relative">
                                    {leaderboardData[0]?.isUser ? (
                                        <User className="h-7 w-7 sm:h-10 sm:w-10 text-violet-400 mx-auto mb-1 sm:mb-2 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
                                    ) : (
                                        <Crown className="h-7 w-7 sm:h-10 sm:w-10 text-yellow-400 mx-auto mb-1 sm:mb-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                                    )}
                                    <p className="text-[9px] sm:text-xs text-yellow-400 font-bold mb-0.5 sm:mb-1">#1 CHAMPION</p>
                                    <p className={`font-bold text-[10px] sm:text-base truncate mb-0.5 sm:mb-1 ${leaderboardData[0]?.isUser ? 'text-violet-300' : ''}`}>
                                        {leaderboardData[0]?.isUser ? '⭐ ' : ''}{leaderboardData[0]?.name}
                                    </p>
                                    <p className="text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                                        ${Number(leaderboardData[0]?.total_sent).toLocaleString()}
                                    </p>
                                    <Badge className="mt-1 sm:mt-2 bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[8px] sm:text-[10px]">
                                        <Flame className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                        Top Waster
                                    </Badge>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 3rd Place */}
                        <div className="mt-6 sm:mt-8">
                            <Card className={`${leaderboardData[2]?.isUser ? 'border-violet-500/30 ring-1 ring-violet-500/20' : 'border-amber-600/20'} bg-gradient-to-b from-amber-600/10 to-transparent backdrop-blur-sm text-center overflow-hidden`}>
                                <div className="h-0.5 sm:h-1 bg-gradient-to-r from-amber-600 to-orange-600" />
                                <CardContent className="p-2 sm:p-4 pt-3 sm:pt-5">
                                    {leaderboardData[2]?.isUser ? (
                                        <User className="h-6 w-6 sm:h-8 sm:w-8 text-violet-400 mx-auto mb-1 sm:mb-2" />
                                    ) : (
                                        <Medal className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 mx-auto mb-1 sm:mb-2" />
                                    )}
                                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">#3</p>
                                    <p className={`font-bold text-[10px] sm:text-sm truncate mb-0.5 sm:mb-1 ${leaderboardData[2]?.isUser ? 'text-violet-300' : ''}`}>
                                        {leaderboardData[2]?.isUser ? '⭐ ' : ''}{leaderboardData[2]?.name}
                                    </p>
                                    <p className="text-sm sm:text-lg font-bold text-amber-500">${Number(leaderboardData[2]?.total_sent).toLocaleString()}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Full Leaderboard */}
                {!loading && leaderboardData.length > 0 && (
                    <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                        <CardHeader className="pb-2 px-4 sm:px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                                        All Subscribers
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">
                                        Ranked by total funds sent — verified on the Solana blockchain
                                    </CardDescription>
                                </div>

                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Header */}
                            <div className="hidden md:grid grid-cols-[60px_1fr_120px_80px] gap-4 px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-white/5 bg-white/[0.02]">
                                <span>Rank</span>
                                <span>Subscriber</span>
                                <span className="text-right">Total Wasted (USD)</span>
                                <span className="text-right">Details</span>
                            </div>

                            <div className="divide-y divide-white/[0.03]">
                                {leaderboardData.map((entry) => (
                                    <div key={entry.id}>
                                        {/* Desktop row */}
                                        <div
                                            className={`hidden md:grid grid-cols-[60px_1fr_120px_80px] gap-4 px-6 py-3.5 items-center transition-all duration-200 hover:bg-white/[0.03] ${getRankBg(entry.rank, !!entry.isUser)}`}
                                        >
                                            <div className="flex items-center justify-center">
                                                {getRankIcon(entry.rank)}
                                            </div>
                                            <div className="min-w-0 flex items-center gap-2">
                                                {entry.isUser && <User className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />}
                                                <p className={`font-semibold text-sm truncate ${entry.isUser ? 'text-violet-300' : entry.rank === 1 ? 'text-yellow-300' : entry.rank <= 3 ? 'text-foreground' : ''
                                                    }`}>
                                                    {entry.isUser ? '⭐ ' : ''}{entry.name}
                                                    {entry.isUser && <span className="text-[10px] text-violet-400/60 ml-1">(You)</span>}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`font-bold text-sm ${entry.isUser ? 'text-violet-300' : entry.rank === 1 ? 'text-yellow-400' : entry.rank <= 3 ? 'text-violet-300' : ''
                                                    }`}>
                                                    ${Number(entry.total_sent).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="outline" className="text-[10px] border-violet-500/20 text-violet-300 bg-violet-500/5">
                                                    Verified
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Mobile row */}
                                        <div
                                            className={`md:hidden flex items-center gap-3 px-4 py-3 transition-all ${getRankBg(entry.rank, !!entry.isUser)}`}
                                        >
                                            <div className="flex items-center justify-center w-8 flex-shrink-0">
                                                {getRankIcon(entry.rank)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    {entry.isUser && <User className="h-3 w-3 text-violet-400 flex-shrink-0" />}
                                                    <p className={`font-semibold text-xs truncate ${entry.isUser ? 'text-violet-300' : entry.rank === 1 ? 'text-yellow-300' : ''
                                                        }`}>
                                                        {entry.isUser ? '⭐ ' : ''}{entry.name}
                                                        {entry.isUser && <span className="text-[9px] text-violet-400/60 ml-0.5">(You)</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                <span className={`font-bold text-xs ${entry.isUser ? 'text-violet-300' : entry.rank === 1 ? 'text-yellow-400' : entry.rank <= 3 ? 'text-violet-300' : ''
                                                    }`}>
                                                    ${Number(entry.total_sent).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Bottom CTA */}
                <div className="text-center mt-8 sm:mt-12">
                    <p className="text-muted-foreground mb-4 text-sm">
                        Not on the leaderboard yet? That's embarrassing.
                    </p>
                    <Link to="/signup">
                        <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 cursor-pointer">
                            Waste Money Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/5 py-6 sm:py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-500">
                            <Ban className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold">SubForNothing</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                        © {new Date().getFullYear()} SubForNothing. No rights reserved because there is nothing to copyright.
                    </p>
                </div>
            </footer>
        </div>
    )
}
