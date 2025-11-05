import { useState, useEffect } from 'react';
import { MapPin, Clock, Leaf, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Donation } from '../lib/supabase';

interface NearbyPageProps {
  onNavigate: (page: string) => void;
}

export default function NearbyPage({ onNavigate }: NearbyPageProps) {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<(Donation & { donor: { name: string; organization_type?: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    loadDonations();
    getUserLocation();

    const channel = supabase
      .channel('donations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations',
        },
        () => {
          loadDonations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getUserLocation = () => {
    if (profile?.latitude && profile?.longitude) {
      setUserLocation({ latitude: profile.latitude, longitude: profile.longitude });
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  };

  const loadDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          donor:profiles!donations_donor_id_fkey(name, organization_type)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const validDonations = (data || []).filter((donation) => {
        return new Date(donation.expiry_time) > now;
      });

      setDonations(validDonations as typeof donations);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getTimeRemaining = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 1) {
      return { text: `${minutes} min`, urgent: true };
    }
    return { text: `${hours}h ${minutes}m`, urgent: hours < 2 };
  };

  const handleCollect = async (donationId: string) => {
    if (!profile) return;

    setCollecting(donationId);
    try {
      const { error: updateError } = await supabase
        .from('donations')
        .update({
          status: 'collected',
          receiver_id: profile.id,
          pickup_time: new Date().toISOString(),
        })
        .eq('id', donationId);

      if (updateError) throw updateError;

      const { error: logError } = await supabase.from('collection_logs').insert({
        donation_id: donationId,
        receiver_id: profile.id,
      });

      if (logError) throw logError;

      await loadDonations();
    } catch (error) {
      console.error('Error collecting donation:', error);
      alert('Failed to collect donation. Please try again.');
    } finally {
      setCollecting(null);
    }
  };

  const getFoodTypeIcon = (foodType: string) => {
    switch (foodType) {
      case 'veg':
        return '🥗';
      case 'non-veg':
        return '🍗';
      case 'vegan':
        return '🌱';
      default:
        return '🍽️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading nearby donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nearby Food Donations</h1>
          <p className="text-gray-600">
            {donations.length} active donation{donations.length !== 1 ? 's' : ''} available for pickup
          </p>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No donations available right now
            </h3>
            <p className="text-gray-500">
              Check back soon for new food donations in your area
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => {
              const timeRemaining = getTimeRemaining(donation.expiry_time);
              const distance = userLocation
                ? calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    donation.latitude,
                    donation.longitude
                  )
                : null;

              return (
                <div
                  key={donation.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                    timeRemaining.urgent ? 'border-2 border-red-400' : ''
                  }`}
                >
                  {donation.image_url ? (
                    <img
                      src={donation.image_url}
                      alt={donation.item_name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <span className="text-6xl">{getFoodTypeIcon(donation.food_type)}</span>
                    </div>
                  )}

                  {timeRemaining.urgent && (
                    <div className="bg-red-500 text-white px-4 py-2 text-center font-medium">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      URGENT: Expires soon!
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{donation.item_name}</h3>
                      <span className="text-2xl">{getFoodTypeIcon(donation.food_type)}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Package className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{donation.quantity}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className={`h-4 w-4 mr-2 flex-shrink-0 ${timeRemaining.urgent ? 'text-red-500' : ''}`} />
                        <span className={`text-sm ${timeRemaining.urgent ? 'text-red-600 font-medium' : ''}`}>
                          {timeRemaining.text} remaining
                        </span>
                      </div>

                      {distance !== null && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{distance.toFixed(1)} km away</span>
                        </div>
                      )}
                    </div>

                    {donation.description && (
                      <p className="text-sm text-gray-600 mb-4">{donation.description}</p>
                    )}

                    <div className="border-t pt-4 mb-4">
                      <p className="text-xs text-gray-500 mb-1">Donated by</p>
                      <p className="font-semibold text-gray-800">{donation.donor.name}</p>
                      {donation.donor.organization_type && (
                        <p className="text-xs text-gray-500 capitalize">
                          {donation.donor.organization_type}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleCollect(donation.id)}
                      disabled={collecting === donation.id}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {collecting === donation.id ? (
                        'Collecting...'
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Collect This Food
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
