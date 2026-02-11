import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/store/useUser'
import { Ban, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login, isLoggedIn } = useUser()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        const result = await login(email, password)

        if (result.error) {
            setError(result.error)
            setIsLoading(false)
            return
        }

        setIsLoading(false)
        navigate('/dashboard')
    }

    // If already logged in, redirect
    if (isLoggedIn) {
        return (
            <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 py-8">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">You're already logged in!</h2>
                    <p className="text-sm text-muted-foreground mb-4">Head to the dashboard to see your nothing.</p>
                    <Link to="/dashboard">
                        <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white cursor-pointer">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/3 left-1/3 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-violet-600/15 blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/3 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-pulse [animation-delay:1s]" />
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
                        <CardTitle className="text-xl sm:text-2xl font-bold">Welcome back to nothing</CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                            Log in to access your premium nothing experience
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-4 sm:px-6">
                        {/* Error display */}
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-300">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="waster@money.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-10 sm:h-11 text-sm border-white/10 bg-white/[0.03] placeholder:text-muted-foreground/50 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Password</Label>
                                    <span className="text-[10px] sm:text-xs text-violet-400/60">
                                        Forgot? (We also forgot)
                                    </span>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-10 sm:h-11 text-sm pr-10 border-white/10 bg-white/[0.03] placeholder:text-muted-foreground/50 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30 transition-all"
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

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 cursor-pointer disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging into the void...
                                    </>
                                ) : (
                                    'Log In to Nothing'
                                )}
                            </Button>
                        </form>

                        <Separator className="my-4 sm:my-6 bg-white/5" />

                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
                                    Sign up for nothing
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs text-muted-foreground/50 px-4">
                    By logging in, you agree to continue receiving nothing.
                </p>
            </div>
        </div>
    )
}
