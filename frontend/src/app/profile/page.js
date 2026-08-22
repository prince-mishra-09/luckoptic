'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Plus, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user, loading, token, updateProfile, saveAddress, deleteAddress } = useAuth();
  const router = useRouter();

  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India', addressId: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [btnLoading, setBtnLoading] = useState(false);

  // Authenticate Route Guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    } else if (user) {
      Promise.resolve().then(() => {
        setProfileForm({ name: user.name, email: user.email, phone: user.phone, password: '' });
      });
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setMsg({ type: '', text: '' });

    const res = await updateProfile(profileForm);
    if (res.success) {
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setProfileForm((prev) => ({ ...prev, password: '' }));
    } else {
      setMsg({ type: 'error', text: res.message });
    }
    setBtnLoading(false);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    const res = await saveAddress(addressForm);
    if (res.success) {
      setMsg({ type: 'success', text: addressForm.addressId ? 'Address updated!' : 'Address added!' });
      setAddressForm({ street: '', city: '', state: '', zipCode: '', country: 'India', addressId: '' });
      setShowAddressForm(false);
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  const handleEditAddress = (addr) => {
    setAddressForm({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      addressId: addr._id
    });
    setShowAddressForm(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDeleteAddress = async (addrId) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const res = await deleteAddress(addrId);
      if (res.success) {
        setMsg({ type: 'success', text: 'Address deleted.' });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Account Info Card */}
        <div className="space-y-6">
          <div className="bg-luckoptics-dark text-white p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
              <User size={180} />
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold font-display text-luckoptics-primary">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">{user.name}</h3>
                <p className="text-xs text-gray-300">{user.email}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-luckoptics-gold font-semibold uppercase tracking-wider bg-white/5 py-1 px-3.5 rounded-full w-fit">
                <ShieldCheck size={14} />
                <span>{user.role} Account</span>
              </div>
              <p className="text-[10px] text-gray-400">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Editors */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Notifications */}
          {msg.text && (
            <div className={`p-4 rounded-xl border text-xs font-semibold ${
              msg.type === 'success'
                ? 'bg-green-50 border-green-200/50 text-green-700'
                : 'bg-red-50 border-red-200/50 text-red-700'
            }`}>
              {msg.text}
            </div>
          )}

          {/* Profile Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <h3 className="font-display font-extrabold text-lg text-luckoptics-dark border-b border-gray-100 pb-3">
              Profile Management
            </h3>

            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Update Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  placeholder="New password (min 6 characters)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={btnLoading}
                className="w-full sm:col-span-2 bg-luckoptics-primary text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-luckoptics-primary/95 transition-all cursor-pointer"
              >
                {btnLoading ? 'Saving changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Shipping Addresses */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-display font-extrabold text-lg text-luckoptics-dark">Shipping Address Book</h3>
              <button
                onClick={() => {
                  setAddressForm({ street: '', city: '', state: '', zipCode: '', country: 'India', addressId: '' });
                  setShowAddressForm(!showAddressForm);
                }}
                className="flex items-center gap-1 bg-luckoptics-primary/10 text-luckoptics-primary font-bold text-xs px-3.5 py-1.5 rounded-full hover:bg-luckoptics-primary/15 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>{showAddressForm ? 'Cancel' : 'Add New'}</span>
              </button>
            </div>

            {/* Address input form */}
            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat/House No., Street Name, Area"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Lucknow"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Uttar Pradesh"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Zip Code</label>
                  <input
                    type="text"
                    required
                    placeholder="226001"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Country</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="sm:col-span-2 bg-luckoptics-dark text-white font-bold text-sm py-3 rounded-xl hover:bg-luckoptics-dark/95 transition-all shadow-md cursor-pointer"
                >
                  {addressForm.addressId ? 'Update Address' : 'Save Address'}
                </button>
              </form>
            )}

            {/* List of user saved addresses */}
            <div className="space-y-3">
              {!user.addresses || user.addresses.length === 0 ? (
                <p className="text-xs text-gray-400">No addresses saved yet. Add one to enable speed checkout.</p>
              ) : (
                user.addresses.map((addr) => (
                  <div key={addr._id} className="flex justify-between items-start p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex gap-3">
                      <MapPin size={18} className="text-luckoptics-primary mt-0.5" />
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-gray-800">{addr.street}</p>
                        <p className="text-gray-500">{addr.city}, {addr.state} - {addr.zipCode}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{addr.country}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAddress(addr)}
                        className="p-1.5 hover:bg-white text-gray-500 hover:text-luckoptics-primary rounded-lg border border-transparent hover:border-gray-100 transition-all cursor-pointer"
                        title="Edit address"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                        title="Delete address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
