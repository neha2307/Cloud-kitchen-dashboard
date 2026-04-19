import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Orders from './pages/Orders.jsx'
import Menu from './pages/Menu.jsx'
import Customers from './pages/Customers.jsx'
import Finance from './pages/Finance.jsx'
import Analytics from './pages/Analytics.jsx'
import SettingsPage from './pages/Settings.jsx'
import AppShell from './components/AppShell.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index                element={<ProtectedRoute accessKey="dashboard"><Dashboard /></ProtectedRoute>} />
        <Route path="orders"        element={<ProtectedRoute accessKey="orders"><Orders /></ProtectedRoute>} />
        <Route path="menu"          element={<ProtectedRoute accessKey="menu"><Menu /></ProtectedRoute>} />
        <Route path="customers"     element={<ProtectedRoute accessKey="customers"><Customers /></ProtectedRoute>} />
        <Route path="finance"       element={<ProtectedRoute accessKey="finance"><Finance /></ProtectedRoute>} />
        <Route path="analytics"     element={<ProtectedRoute accessKey="analytics"><Analytics /></ProtectedRoute>} />
        <Route path="settings"      element={<ProtectedRoute accessKey="settings"><SettingsPage /></ProtectedRoute>} />
      </Route>

      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}
