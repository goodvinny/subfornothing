import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import {
    Ban,
    Ghost,
    Sparkles,
    Zap,
    ShieldOff,
    Clock,
    CheckCircle2,
    Star,
    ArrowRight,
    Infinity,
    Trophy,
} from 'lucide-react'



const features = [
    {
        icon: Ban,
        title: 'Absolutely Nothing',
        description: 'Get access to our premium suite of nothing. Zero features, zero value, zero regrets.',
    },
    {
        icon: Ghost,
        title: 'Invisible Dashboard',
        description: 'A beautifully designed empty dashboard. It does nothing — but it looks great doing it.',
    },
    {
        icon: ShieldOff,
        title: 'No Security',
        description: "We don't protect your data because we don't collect any. Privacy through apathy.",
    },
    {
        icon: Clock,
        title: '24/7 No Support',
        description: "Our support team doesn't exist. But if they did, they'd be unavailable around the clock.",
    },
    {
        icon: Zap,
        title: 'Lightning Fast Nothing',
        description: 'Our servers deliver nothing at blazing speeds. Sub-millisecond emptiness.',
    },
    {
        icon: Sparkles,
        title: 'AI-Powered Void',
        description: 'We trained a model on nothing. It learned nothing. Now it does nothing. Groundbreaking.',
    },
]

const testimonials = [
    {
        name: 'Chad Entrepreneur',
        role: 'CEO of Nothing Inc.',
        quote: "I've been subscribed for 6 months and I've gotten exactly what was promised. Nothing. 10/10.",
        stars: 5,
    },
    {
        name: 'Karen Reviews',
        role: 'Professional Subscriber',
        quote: "I demanded to speak to the manager about getting nothing. They confirmed I'm getting everything I paid for.",
        stars: 5,
    },
    {
        name: 'Dave Broke',
        role: 'Financial Advisor',
        quote: "As a financial advisor, I can confirm this is the worst investment I've ever made. I love it.",
        stars: 5,
    },
]

export default function LandingPage() {
    const [subCount, setSubCount] = useState(0)
    const [totalWasted, setTotalWasted] = useState(0)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Count paid subscribers
                const { count } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('has_paid', true)
                if (count !== null) setSubCount(count)

                // Sum total wasted from all profiles
                const { data } = await supabase
                    .from('profiles')
                    .select('total_sent')
                    .gt('total_sent', 0)
                if (data) {
                    const total = data.reduce((acc: number, row: any) => acc + (Number(row.total_sent) || 0), 0)
                    setTotalWasted(total)
                }
            } catch (err) {
                console.warn('[LandingPage] Failed to fetch stats:', err)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 pt-24 sm:pt-32">
                {/* Animated gradient background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-fuchsia-600/15 blur-[100px] animate-pulse [animation-delay:1s]" />
                    <div className="absolute top-1/2 left-1/2 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[80px] animate-pulse [animation-delay:2s]" />
                    {/* Bottom fade — blends purple into the black background on desktop */}
                    <div className="hidden md:block absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-background" />
                </div>

                {/* Grid pattern overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
                {/* Grid fade at bottom so lines don't cut off sharply */}
                <div className="hidden md:block pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-background z-[1]" />

                <div className="relative z-10 mx-auto max-w-4xl text-center">


                    <h1 className="mb-4 sm:mb-6 text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                        Pay{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                            any amount
                        </span>
                        <br />
                        for a{' '}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400">
                                lifetime of nothing.
                            </span>
                            <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full opacity-60" />
                        </span>
                    </h1>

                    <p className="mx-auto mb-8 sm:mb-10 max-w-2xl text-sm sm:text-lg lg:text-xl text-muted-foreground leading-relaxed px-2">
                        The world's first premium{' '}
                        <span className="text-foreground font-medium">lifetime subscription</span> that delivers
                        nothing — forever. Send SOL, USDC, or USDT. The more you send, the higher you rank on
                        our{' '}
                        <Link to="/leaderboard" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                            leaderboard of shame
                        </Link>
                        .
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4 sm:px-0">
                        <Link to="/signup" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="group w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-105 cursor-pointer"
                            >
                                Get Nothing Forever
                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link to="/leaderboard" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                variant="outline"
                                className="group w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all cursor-pointer"
                            >
                                <Trophy className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                                View Leaderboard
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-muted-foreground px-4">
                        Minimum $10 in SOL, USDC, or USDT. No free trial — why would we give away nothing for free?
                    </p>

                    {/* Social proof */}
                    <div className="mt-10 sm:mt-16 flex items-center justify-center gap-4 sm:gap-8 text-muted-foreground">
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">0</p>
                            <p className="text-xs sm:text-sm">Features</p>
                        </div>
                        <Separator orientation="vertical" className="h-8 sm:h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">{subCount.toLocaleString()}</p>
                            <p className="text-xs sm:text-sm">Lifetime Subs</p>
                        </div>
                        <Separator orientation="vertical" className="h-8 sm:h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">${totalWasted.toLocaleString()}</p>
                            <p className="text-xs sm:text-sm">Total Wasted</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-16 sm:py-32 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-10 sm:mb-16">
                        <Badge variant="outline" className="mb-4 border-violet-500/30 bg-violet-500/10 text-violet-300 px-3 py-1 text-xs">
                            Features (or lack thereof)
                        </Badge>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            Everything you{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                won't
                            </span>{' '}
                            get
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-4">
                            We've spent years perfecting the art of delivering nothing. Here's what you're not getting.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="group relative border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-violet-500/20 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/5"
                            >
                                <CardHeader className="pb-2 sm:pb-4">
                                    <div className="mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 ring-1 ring-violet-500/10 transition-all duration-300 group-hover:from-violet-600/30 group-hover:to-fuchsia-600/30 group-hover:ring-violet-500/20">
                                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400 transition-colors group-hover:text-violet-300" />
                                    </div>
                                    <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="relative py-16 sm:py-32 px-4 sm:px-6">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[150px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-lg">
                    <div className="text-center mb-8 sm:mb-12">
                        <Badge variant="outline" className="mb-4 border-violet-500/30 bg-violet-500/10 text-violet-300 px-3 py-1 text-xs">
                            Lifetime Pricing
                        </Badge>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            One lifetime. Any price.{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                Zero value.
                            </span>
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base px-2">
                            Pay what you want (min $10). The more you pay, the higher you rank. It's competitive nothingness.
                        </p>
                    </div>

                    <Card className="relative overflow-hidden border-violet-500/20 bg-white/[0.03] backdrop-blur-sm shadow-2xl shadow-violet-500/10">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />

                        <CardHeader className="text-center pb-2 relative">
                            <Badge className="mx-auto mb-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white border-0 text-xs">
                                Most Pointless
                            </Badge>
                            <CardTitle className="text-xl sm:text-2xl">The Nothing Plan</CardTitle>
                            <div className="mt-4 flex items-baseline justify-center gap-1">
                                <span className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                    $10+
                                </span>
                                <span className="text-muted-foreground text-sm">/lifetime</span>
                            </div>
                            <CardDescription className="mt-2 text-xs sm:text-sm">
                                Send any amount in SOL, USDC, or USDT. Your wallet. Your choice. Your loss.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="relative">
                            <Separator className="my-4 sm:my-6 bg-white/5" />



                            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                {[
                                    'Lifetime access to absolutely nothing',
                                    'Climb the leaderboard of shame',
                                    'Empty dashboard with premium vibes',
                                    'No customer support whatsoever',
                                    'Zero updates, ever',
                                    'Bragging rights to your friends',
                                    'A receipt proving your terrible judgment',
                                    'Unlimited access to the void — forever',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 text-violet-400 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/signup" className="block">
                                <Button
                                    size="lg"
                                    className="w-full h-12 sm:h-13 text-base sm:text-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 cursor-pointer"
                                >
                                    Subscribe to Nothing Forever
                                </Button>
                            </Link>

                            <p className="mt-4 text-center text-[10px] sm:text-xs text-muted-foreground">
                                No refunds. You knew what you were getting into. Don't forget to resubscribe every lifetime.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-32 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-10 sm:mb-16">
                        <Badge variant="outline" className="mb-4 border-violet-500/30 bg-violet-500/10 text-violet-300 px-3 py-1 text-xs">
                            Testimonials
                        </Badge>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            What our subscribers{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                aren't
                            </span>{' '}
                            saying
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={index}
                                className="border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-violet-500/10"
                            >
                                <CardContent className="pt-5 sm:pt-6">
                                    <div className="mb-3 sm:mb-4 flex gap-0.5">
                                        {Array.from({ length: testimonial.stars }).map((_, i) => (
                                            <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-violet-400 text-violet-400" />
                                        ))}
                                    </div>
                                    <p className="mb-4 sm:mb-6 text-muted-foreground italic leading-relaxed text-xs sm:text-sm">
                                        "{testimonial.quote}"
                                    </p>
                                    <div>
                                        <p className="font-semibold text-xs sm:text-sm">{testimonial.name}</p>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="relative py-16 sm:py-32 px-4 sm:px-6">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute bottom-0 left-1/2 h-[300px] w-[500px] sm:h-[400px] sm:w-[800px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-2xl text-center">
                    <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 ring-1 ring-violet-500/20 mb-6 sm:mb-8">
                        <Infinity className="h-8 w-8 sm:h-10 sm:w-10 text-violet-400" />
                    </div>
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
                        Ready to get{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            nothing forever
                        </span>
                        ?
                    </h2>
                    <p className="text-sm sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed px-4">
                        Join the fastest-growing community of people paying for absolutely nothing.
                        Don't miss out on what everyone else is missing out on. And don't forget to{' '}
                        <span className="text-foreground font-medium">resubscribe every lifetime</span>.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4 sm:px-0">
                        <Link to="/signup" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="group w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-105 cursor-pointer"
                            >
                                Waste Money Forever
                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link to="/leaderboard" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all cursor-pointer"
                            >
                                <Trophy className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                                Leaderboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 sm:py-12 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-3 sm:gap-4 sm:flex-row">
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
