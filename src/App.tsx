import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DonatePage from './components/DonatePage';
import NearbyPage from './components/NearbyPage';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Auth onSuccess={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
      {currentPage === 'donate' && profile.user_type === 'donor' && (
        <DonatePage onNavigate={setCurrentPage} />
      )}
      {currentPage === 'nearby' && profile.user_type === 'receiver' && (
        <NearbyPage onNavigate={setCurrentPage} />
      )}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'profile' && <Profile />}
      {currentPage === 'admin' && profile.user_type === 'admin' && <AdminPanel />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
