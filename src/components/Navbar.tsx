import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Ban, Trophy, Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { useUser } from '@/store/useUser'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { isLoggedIn, logout } = useUser()

    const handleLogout = async () => {
        await logout()
        setMobileOpen(false)
        navigate('/')
    }

    const isActive = (path: string) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setMobileOpen(false)}>
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:scale-110">
                        <Ban className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                        Sub<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">ForNothing</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/leaderboard">
                        <Button
                            variant="ghost"
                            className={`transition-colors cursor-pointer gap-2 ${isActive('/leaderboard') ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'
                                }`}
                        >
                            <Trophy className="h-4 w-4" />
                            Leaderboard
                        </Button>
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="ghost" className={`transition-colors cursor-pointer gap-2 ${isActive('/dashboard') ? 'text-violet-400' : 'text-muted-foreground hover:text-foreground'}`}>
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="text-muted-foreground hover:text-red-400 transition-colors cursor-pointer gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 cursor-pointer">
                                    Subscribe to Nothing
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all cursor-pointer"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl animate-fade-in">
                    <div className="flex flex-col gap-2 p-4">
                        <Link to="/leaderboard" onClick={() => setMobileOpen(false)}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-2 cursor-pointer ${isActive('/leaderboard') ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'
                                    }`}
                            >
                                <Trophy className="h-4 w-4" />
                                Leaderboard
                            </Button>
                        </Link>
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                                    <Button variant="ghost" className={`w-full justify-start gap-2 cursor-pointer ${isActive('/dashboard') ? 'text-violet-400' : 'text-muted-foreground hover:text-foreground'}`}>
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="w-full justify-start gap-2 text-muted-foreground hover:text-red-400 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground cursor-pointer">
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                                    <Button className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 cursor-pointer">
                                        Subscribe to Nothing
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
