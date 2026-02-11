import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './store/useUser'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import LeaderboardPage from './pages/LeaderboardPage'

function App() {
  return (
    <UserProvider>
      <div className="dark min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App
