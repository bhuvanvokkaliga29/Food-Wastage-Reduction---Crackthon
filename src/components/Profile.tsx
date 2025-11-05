import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Building2, Save, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { profile, updateProfile, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    organizationType: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        organizationType: profile.organization_type || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        organization_type: formData.organizationType || undefined,
      });

      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;

          setFormData({ ...formData, address });

          try {
            await updateProfile({ latitude, longitude, address });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } catch (error) {
            console.error('Error updating location:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get location. Please allow location access.');
        }
      );
    }
  };

  const organizationTypes = {
    donor: [
      { value: 'hotel', label: 'Hotel/Restaurant' },
      { value: 'event', label: 'Event/Function' },
      { value: 'canteen', label: 'Canteen/Mess' },
      { value: 'household', label: 'Household' },
    ],
    receiver: [
      { value: 'ngo', label: 'NGO' },
      { value: 'individual', label: 'Individual Helper' },
      { value: 'community', label: 'Community Group' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white rounded-full p-6">
                <User className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center">{profile?.name}</h1>
            <p className="text-green-100 text-center mt-2 capitalize">
              {profile?.user_type} Account
            </p>
          </div>

          <div className="p-8">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">Profile updated successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="inline h-4 w-4 mr-1" />
                  Organization Type
                </label>
                <select
                  value={formData.organizationType}
                  onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select type (optional)</option>
                  {(profile?.user_type === 'donor'
                    ? organizationTypes.donor
                    : organizationTypes.receiver
                  ).map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  rows={2}
                  placeholder="Your address"
                />
                {editing && (
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Use current location
                  </button>
                )}
              </div>

              {profile?.latitude && profile?.longitude && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium mb-1">
                    Location coordinates saved
                  </p>
                  <p className="text-xs text-green-700">
                    Lat: {profile.latitude.toFixed(6)}, Long: {profile.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        if (profile) {
                          setFormData({
                            name: profile.name || '',
                            phone: profile.phone || '',
                            address: profile.address || '',
                            organizationType: profile.organization_type || '',
                          });
                        }
                      }}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="h-5 w-5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Account Type</p>
                  <p className="font-semibold text-gray-800 capitalize">{profile?.user_type}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="font-semibold text-gray-800">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
