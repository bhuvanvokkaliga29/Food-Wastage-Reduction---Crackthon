import { useState, useEffect } from 'react';
import { Upload, MapPin, Clock, Leaf, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DonatePageProps {
  onNavigate: (page: string) => void;
}

export default function DonatePage({ onNavigate }: DonatePageProps) {
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    description: '',
    foodType: 'veg' as 'veg' | 'non-veg' | 'vegan',
    expiryHours: '2',
    imageUrl: '',
  });

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (profile?.latitude && profile?.longitude) {
      setLocation({
        latitude: profile.latitude,
        longitude: profile.longitude,
        address: profile.address || 'Current location',
      });
    }
  }, [profile]);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const address = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;

          setLocation({ latitude, longitude, address });

          if (profile && (!profile.latitude || !profile.longitude)) {
            await updateProfile({ latitude, longitude, address });
          }

          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get location. Please allow location access.');
          setLocationLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!location) {
      setError('Please get your current location first');
      return;
    }

    setLoading(true);

    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + parseInt(formData.expiryHours));

      const qrCode = `ZWC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { error: insertError } = await supabase.from('donations').insert({
        donor_id: profile?.id,
        item_name: formData.itemName,
        quantity: formData.quantity,
        description: formData.description,
        food_type: formData.foodType,
        expiry_time: expiryTime.toISOString(),
        image_url: formData.imageUrl || null,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        qr_code: qrCode,
        status: 'pending',
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        itemName: '',
        quantity: '',
        description: '',
        foodType: 'veg',
        expiryHours: '2',
        imageUrl: '',
      });

      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Share Surplus Food</h1>
          <p className="text-gray-600 mb-8">
            Help reduce food waste and feed those in need
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                Food donation posted successfully! Redirecting to dashboard...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Item Name
              </label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Biryani, Chapati, Rice"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 20 plates, 10kg, Feeds 50 people"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Additional details about the food..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'veg', label: 'Vegetarian', icon: '🥗' },
                  { value: 'non-veg', label: 'Non-Veg', icon: '🍗' },
                  { value: 'vegan', label: 'Vegan', icon: '🌱' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, foodType: type.value as typeof formData.foodType })}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                      formData.foodType === type.value
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Best before (hours from now)
              </label>
              <select
                value={formData.expiryHours}
                onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="1">1 hour (Urgent)</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="6">6 hours</option>
                <option value="12">12 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="inline h-4 w-4 mr-1" />
                Food Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                {formData.imageUrl ? (
                  <div className="relative">
                    <img
                      src={formData.imageUrl}
                      alt="Food preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Click to upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Pickup Location
              </label>
              {location ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium mb-1">Location confirmed</p>
                  <p className="text-xs text-green-700">{location.address}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-full py-3 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 transition-colors"
                >
                  {locationLoading ? 'Getting location...' : 'Get Current Location'}
                </button>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Freshness Check</p>
                  <p>Please ensure food is fresh and safe for consumption. Our system checks upload time to maintain quality standards.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !location}
              className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Share Food Donation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
