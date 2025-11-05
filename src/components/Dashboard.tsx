import { useState, useEffect } from 'react';
import { TrendingUp, Package, Users, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Donation } from '../lib/supabase';

export default function Dashboard() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<(Donation & {
    donor?: { name: string };
    receiver?: { name: string };
  })[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    collected: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;

    try {
      let query = supabase.from('donations').select(`
        *,
        donor:profiles!donations_donor_id_fkey(name),
        receiver:profiles!donations_receiver_id_fkey(name)
      `);

      if (profile.user_type === 'donor') {
        query = query.eq('donor_id', profile.id);
      } else if (profile.user_type === 'receiver') {
        query = query.eq('receiver_id', profile.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setDonations(data || []);

      const total = data?.length || 0;
      const pending = data?.filter((d) => d.status === 'pending').length || 0;
      const collected = data?.filter((d) => d.status === 'collected').length || 0;
      const delivered = data?.filter((d) => d.status === 'delivered').length || 0;

      setStats({ total, pending, collected, delivered });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (donationId: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status: 'delivered' })
        .eq('id', donationId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error updating donation:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (donationId: string) => {
    if (!confirm('Are you sure you want to delete this donation?')) return;

    try {
      const { error } = await supabase.from('donations').delete().eq('id', donationId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Failed to delete donation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'collected':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {profile?.user_type === 'donor' ? 'Your food donations' : 'Your collected donations'}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-800">{stats.total}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600">Total</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <span className="text-3xl font-bold text-gray-800">{stats.pending}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600">Pending</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-8 w-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-800">{stats.collected}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600">Collected</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-800">{stats.delivered}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600">Delivered</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {profile?.user_type === 'donor' ? 'My Donations' : 'Collected Food'}
            </h2>
          </div>

          {donations.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No donations yet</h3>
              <p className="text-gray-500">
                {profile?.user_type === 'donor'
                  ? 'Start by sharing surplus food'
                  : 'Start collecting nearby food donations'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {profile?.user_type === 'donor' ? 'Receiver' : 'Donor'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {donation.item_name}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {donation.food_type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{donation.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {profile?.user_type === 'donor'
                            ? donation.receiver?.name || 'Not collected yet'
                            : donation.donor?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                            donation.status
                          )}`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(donation.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {profile?.user_type === 'donor' &&
                            donation.status === 'collected' && (
                              <button
                                onClick={() => handleMarkDelivered(donation.id)}
                                className="text-green-600 hover:text-green-900 font-medium"
                              >
                                Mark Delivered
                              </button>
                            )}
                          {profile?.user_type === 'donor' &&
                            donation.status === 'pending' && (
                              <button
                                onClick={() => handleDelete(donation.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
