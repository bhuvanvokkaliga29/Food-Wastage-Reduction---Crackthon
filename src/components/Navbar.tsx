import { Heart, Menu, X, Home, Plus, MapPin, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    ...(profile?.user_type === 'donor' ? [{ id: 'donate', label: 'Donate', icon: Plus }] : []),
    ...(profile?.user_type === 'receiver' ? [{ id: 'nearby', label: 'Nearby Food', icon: MapPin }] : []),
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Heart className="h-8 w-8 text-green-600 fill-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">
              ZeroWaste<span className="text-green-600">Connect</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
