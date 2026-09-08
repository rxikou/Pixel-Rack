import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import GaragePage from './pages/GaragePage'
import KonbiniPage from './pages/KonbiniPage'
import BackgroundFX from './components/BackgroundFX'
import PageFrame from './components/PageFrame'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BackgroundFX />
        <PageFrame />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/garage"
            element={
              <ProtectedRoute>
                <GaragePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/konbini"
            element={
              <ProtectedRoute>
                <KonbiniPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
