import { Heart, Users, TrendingUp, Leaf, Plus, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    mealsShared: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { count: totalDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });

      const { count: activeDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: mealsShared } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .in('status', ['delivered', 'collected']);

      setStats({
        totalDonations: totalDonations || 0,
        activeDonations: activeDonations || 0,
        mealsShared: mealsShared || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Heart className="h-20 w-20 text-green-600 fill-green-600 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to ZeroWaste<span className="text-green-600">Connect</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share surplus food, feed those in need, and create a zero-waste community
          </p>
          <p className="text-lg text-green-600 font-medium mt-2">
            
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <Leaf className="h-12 w-12 text-green-600" />
              <span className="text-3xl font-bold text-gray-800">{stats.totalDonations}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Total Donations</h3>
            <p className="text-sm text-gray-500 mt-1">Food items shared on platform</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-12 w-12 text-green-600" />
              <span className="text-3xl font-bold text-gray-800">{stats.activeDonations}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Active Donations</h3>
            <p className="text-sm text-gray-500 mt-1">Available for pickup now</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-12 w-12 text-green-600" />
              <span className="text-3xl font-bold text-gray-800">{stats.mealsShared}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Meals Shared</h3>
            <p className="text-sm text-gray-500 mt-1">Successfully distributed</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Hello, {profile?.name}!
          </h2>

          {profile?.user_type === 'donor' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Thank you for being a food donor. Your generosity helps feed those in need and reduces food waste.
              </p>
              <button
                onClick={() => onNavigate('donate')}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Donate Food Now
              </button>
            </div>
          )}

          {profile?.user_type === 'receiver' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Thank you for helping distribute food to those in need. Check nearby donations and make a difference.
              </p>
              <button
                onClick={() => onNavigate('nearby')}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MapPin className="h-5 w-5" />
                Find Nearby Food
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Donors share surplus food</h4>
                  <p className="text-green-100 text-sm">Hotels, events, households post available food items</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Receivers see nearby food</h4>
                  <p className="text-green-100 text-sm">NGOs and helpers find donations on the map</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Food reaches those in need</h4>
                  <p className="text-green-100 text-sm">Zero waste, zero hunger, maximum kindness</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                ZeroWasteConnect is built on the principle of humanity first. We believe that no one should go hungry when there's surplus food available.
              </p>
              <p>
                Our platform connects generous donors with dedicated receivers, creating a community of kindness that feeds the hungry and protects the environment.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-green-800 font-medium">
                  Remember: Every meal shared is a life touched, every donation is an act of love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
