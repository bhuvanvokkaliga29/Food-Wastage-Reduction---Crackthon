import { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalUsers: number;
  donors: number;
  receivers: number;
  totalDonations: number;
  pending: number;
  collected: number;
  delivered: number;
}

export default function AdminPanel() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    donors: 0,
    receivers: 0,
    totalDonations: 0,
    pending: 0,
    collected: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: donors } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'donor');

      const { count: receivers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'receiver');

      const { count: totalDonations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });

      const { count: pending } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: collected } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'collected');

      const { count: delivered } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered');

      setStats({
        totalUsers: totalUsers || 0,
        donors: donors || 0,
        receivers: receivers || 0,
        totalDonations: totalDonations || 0,
        pending: pending || 0,
        collected: collected || 0,
        delivered: delivered || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Platform overview and management</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-12 w-12 text-blue-600" />
              <span className="text-4xl font-bold text-gray-800">{stats.totalUsers}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{stats.donors} Donors</span>
              <span>{stats.receivers} Receivers</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <Package className="h-12 w-12 text-green-600" />
              <span className="text-4xl font-bold text-gray-800">{stats.totalDonations}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Donations</h3>
            <div className="text-sm text-gray-500">All time food items shared</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-12 w-12 text-green-600" />
              <span className="text-4xl font-bold text-gray-800">{stats.delivered}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Meals Delivered</h3>
            <div className="text-sm text-gray-500">Successfully distributed</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Donation Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">Pending</p>
                  <p className="text-sm text-gray-500">Awaiting collection</p>
                </div>
                <span className="text-3xl font-bold text-yellow-600">{stats.pending}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">Collected</p>
                  <p className="text-sm text-gray-500">In transit</p>
                </div>
                <span className="text-3xl font-bold text-blue-600">{stats.collected}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700">Delivered</p>
                  <p className="text-sm text-gray-500">Successfully distributed</p>
                </div>
                <span className="text-3xl font-bold text-green-600">{stats.delivered}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Impact</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Success Rate</span>
                  <span className="text-sm font-bold text-green-600">
                    {stats.totalDonations > 0
                      ? Math.round((stats.delivered / stats.totalDonations) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${stats.totalDonations > 0 ? (stats.delivered / stats.totalDonations) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Collection Rate</span>
                  <span className="text-sm font-bold text-blue-600">
                    {stats.totalDonations > 0
                      ? Math.round(
                          ((stats.collected + stats.delivered) / stats.totalDonations) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${stats.totalDonations > 0 ? ((stats.collected + stats.delivered) / stats.totalDonations) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white">
                <p className="text-sm mb-1">Total Impact</p>
                <p className="text-2xl font-bold">
                  {stats.delivered + stats.collected} meals saved from waste
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average donation turnaround</span>
                  <span className="font-semibold text-gray-800">2-3 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active donors</span>
                  <span className="font-semibold text-gray-800">{stats.donors}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active receivers</span>
                  <span className="font-semibold text-gray-800">{stats.receivers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform efficiency</span>
                  <span className="font-semibold text-green-600">High</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Platform Mission</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  ZeroWasteConnect is successfully connecting food donors with receivers,
                  reducing food waste and feeding those in need.
                </p>
                <p className="font-medium text-green-700">
                  No money, no points, no rewards — only kindness and humanity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
