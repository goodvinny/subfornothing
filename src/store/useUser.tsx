import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Transaction {
    id: string
    amount: number
    token: string
    tx_signature: string
    created_at: string
}

interface Profile {
    id: string
    name: string
    email: string | null
    has_paid: boolean
    total_sent: number
    created_at: string
}

interface LeaderboardEntry {
    id: string
    name: string
    total_sent: number
}

interface UserContextType {
    // Auth state
    authUser: User | null
    profile: Profile | null
    isLoggedIn: boolean
    isSubscribed: boolean
    isLoading: boolean

    // Auth actions
    signup: (name: string, email: string, password: string) => Promise<{ error?: string }>
    login: (email: string, password: string) => Promise<{ error?: string }>
    logout: () => Promise<void>

    // Transaction actions
    recordTransaction: (amount: number, token: string, txSignature: string) => Promise<{ error?: string }>

    // Data fetching
    fetchTransactions: () => Promise<Transaction[]>
    fetchLeaderboard: () => Promise<LeaderboardEntry[]>
    fetchProfile: () => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [authUser, setAuthUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const isLoggedIn = !!authUser && !!profile
    // User is subscribed ONLY if they have paid
    const isSubscribed = isLoggedIn && !!profile?.has_paid

    // Initialize — check for existing session
    useEffect(() => {
        const init = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    setAuthUser(session.user)
                    await loadProfile(session.user.id)
                }
            } catch (err) {
                console.warn('[useUser] Init error:', err)
            }
            setIsLoading(false)
        }
        init()

        // Listen for auth changes (e.g. token refresh, sign out from another tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthUser(session?.user ?? null)
            if (!session?.user) {
                setProfile(null)
            }
            // Don't load profile here — signup/login already handle it
            // This prevents double-loading races
        })

        return () => subscription.unsubscribe()
    }, [])

    const loadProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (!error && data) {
                setProfile(data as Profile)
            } else {
                console.warn('[useUser] Profile fetch issue:', error?.message)
                // Fallback so login still works even if DB schema is out of date
                setProfile({
                    id: userId,
                    name: 'Subscriber',
                    email: null,
                    has_paid: false,
                    total_sent: 0,
                    created_at: new Date().toISOString(),
                })
            }
        } catch (err) {
            console.warn('[useUser] Failed to load profile:', err)
            setProfile({
                id: userId,
                name: 'Subscriber',
                email: null,
                has_paid: false,
                total_sent: 0,
                created_at: new Date().toISOString(),
            })
        }
    }

    const signup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name },
                },
            })

            if (error) return { error: error.message }
            if (!data.user) return { error: 'Signup failed. Please try again.' }

            // Supabase returns a fake user with empty identities when email is already taken
            if (data.user.identities && data.user.identities.length === 0) {
                return { error: 'An account with this email already exists. Please log in instead.' }
            }

            setAuthUser(data.user)

            // Wait for the DB trigger to create the profile, then load it
            await new Promise((r) => setTimeout(r, 1500))
            await loadProfile(data.user.id)

            return {}
        } catch (err: any) {
            return { error: err.message || 'Signup failed. Please try again.' }
        }
    }

    const login = async (email: string, password: string): Promise<{ error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) return { error: error.message }
            if (!data.user) return { error: 'Login failed. Please try again.' }

            setAuthUser(data.user)
            await loadProfile(data.user.id)

            return {}
        } catch (err: any) {
            return { error: err.message || 'Login failed. Please try again.' }
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        setAuthUser(null)
        setProfile(null)
    }

    const recordTransaction = async (
        amount: number,
        token: string,
        txSignature: string
    ): Promise<{ error?: string }> => {
        if (!authUser) return { error: 'Not logged in' }

        const { error } = await supabase.from('transactions').insert({
            user_id: authUser.id,
            amount,
            token,
            tx_signature: txSignature,
        })

        if (error) {
            // Duplicate signature check
            if (error.code === '23505') {
                return { error: 'This transaction has already been recorded.' }
            }
            return { error: error.message }
        }

        // Refresh profile to get updated total_sent + has_paid
        await loadProfile(authUser.id)
        return {}
    }

    const fetchTransactions = async (): Promise<Transaction[]> => {
        if (!authUser) return []

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false })

        if (error) return []
        return data as Transaction[]
    }

    const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, total_sent')
            .gt('total_sent', 0)
            .order('total_sent', { ascending: false })
            .limit(50)

        if (error) return []
        return data as LeaderboardEntry[]
    }

    const fetchProfile = async () => {
        if (authUser) {
            await loadProfile(authUser.id)
        }
    }

    return (
        <UserContext.Provider
            value={{
                authUser,
                profile,
                isLoggedIn,
                isSubscribed,
                isLoading,
                signup,
                login,
                logout,
                recordTransaction,
                fetchTransactions,
                fetchLeaderboard,
                fetchProfile,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
