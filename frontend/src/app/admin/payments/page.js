'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, CreditCard, QrCode } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminPaymentMethods() {
  const { token } = useAuth();

  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    qrCode: '',
    isActive: true
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const loadMethods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/payment-methods?all=true`);
      const data = await res.json();
      if (data.success) {
        setMethods(data.methods);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (token) {
      Promise.resolve().then(() => {
        loadMethods();
      });
    }
  }, [token, loadMethods]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploadLoading(true);
    setFormMsg({ type: '', text: '' });

    try {
      const authRes = await fetch(`${API_URL}/upload/auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const authData = await authRes.json();

      const uploadPayload = new FormData();
      uploadPayload.append('file', file);
      uploadPayload.append('fileName', file.name);
      uploadPayload.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'your_imagekit_public_key');
      uploadPayload.append('signature', authData.signature);
      uploadPayload.append('expire', authData.expire.toString());
      uploadPayload.append('token', authData.token);
      uploadPayload.append('folder', '/payments');

      const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: uploadPayload
      });
      const ikData = await ikRes.json();

      if (ikData.url) {
        setFormData(prev => ({ ...prev, qrCode: ikData.url }));
        setFormMsg({ type: 'success', text: 'QR code image uploaded!' });
      } else {
        throw new Error(ikData.message || 'ImageKit upload failed');
      }
    } catch (err) {
      console.error(err);
      const randomId = Math.floor(Math.random() * 100);
      const mockUrl = `https://picsum.photos/id/${randomId}/400/400`;
      setFormData(prev => ({ ...prev, qrCode: mockUrl }));
      setFormMsg({ type: 'error', text: 'ImageKit keys unconfigured. Used mock placeholder QR code image.' });
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleEditClick = (method) => {
    setEditingId(method._id);
    setFormData({
      name: method.name,
      desc: method.desc,
      qrCode: method.qrCode || '',
      isActive: method.isActive
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    if (!formData.name || !formData.desc) {
      setFormMsg({ type: 'error', text: 'All fields are required' });
      return;
    }

    try {
      const url = editingId ? `${API_URL}/payment-methods/${editingId}` : `${API_URL}/payment-methods`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg({ type: 'success', text: editingId ? 'Payment method updated successfully!' : 'Payment method added successfully!' });
        setEditingId(null);
        setShowForm(false);
        setFormData({
          name: '',
          desc: '',
          qrCode: '',
          isActive: true
        });
        loadMethods();
      } else {
        setFormMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setFormMsg({ type: 'error', text: 'Connection failed' });
    }
  };

  const handleDeleteClick = async (methodId) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      try {
        const res = await fetch(`${API_URL}/payment-methods/${methodId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          loadMethods();
        } else {
          alert('Delete failed: ' + data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-black text-2xl text-luckoptics-dark leading-tight">Payment Methods</h2>
          <p className="text-xs text-gray-500 mt-1">Configure user-selectable checkout payment options (COD, UPI with QR, Credit Card etc.)</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', desc: '', qrCode: '', isActive: true });
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-luckoptics-primary text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-luckoptics-primary/95 transition-all shadow-md cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Payment Method</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-lg space-y-4 max-w-xl animate-in fade-in duration-200">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-display font-bold text-sm text-luckoptics-dark uppercase tracking-wider">
              {editingId ? 'Edit Payment Method' : 'New Payment Method'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          {formMsg.text && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold ${
              formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {formMsg.text}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Payment Method Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. UPI / Cards / Net Banking"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-hidden font-semibold text-gray-800"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Description</label>
            <input
              type="text"
              name="desc"
              required
              placeholder="e.g. Pay online securely via UPI apps, Credit/Debit cards"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-hidden"
              value={formData.desc}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Optional QR Code Image</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-luckoptics-primary/10 file:text-luckoptics-primary hover:file:bg-luckoptics-primary/15 transition-all file:cursor-pointer"
              />
              {imageUploadLoading && (
                <span className="text-[10px] text-gray-400 font-bold animate-pulse">Uploading QR...</span>
              )}
            </div>
            {formData.qrCode && (
              <div className="mt-3 relative w-32 h-32 border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 shadow-inner">
                <img src={formData.qrCode} alt="QR Code Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, qrCode: '' }))}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-xs cursor-pointer"
                  title="Remove QR Code"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              className="w-4 h-4 text-luckoptics-primary focus:ring-luckoptics-primary border-gray-300 rounded-md"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <label htmlFor="isActive" className="text-xs font-bold text-gray-700 cursor-pointer">
              Active (Visible on Checkout screen)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-5 py-2.5 text-xs font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold bg-luckoptics-primary text-white rounded-xl hover:bg-luckoptics-primary/95 transition-all shadow-md cursor-pointer"
            >
              {editingId ? 'Save Changes' : 'Create Method'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-5">Method Name</th>
                  <th className="p-5">Description</th>
                  <th className="p-5">QR Code Image</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {methods.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 font-semibold">
                      No payment methods configured.
                    </td>
                  </tr>
                ) : (
                  methods.map((method) => (
                    <tr key={method._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-2 bg-luckoptics-primary/5 text-luckoptics-primary rounded-xl">
                          <CreditCard size={14} />
                        </div>
                        <span>{method.name}</span>
                      </td>
                      <td className="p-5 text-gray-500 leading-normal max-w-xs truncate">{method.desc}</td>
                      <td className="p-5">
                        {method.qrCode ? (
                          <a 
                            href={method.qrCode} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block w-10 h-10 border border-gray-200 rounded-lg overflow-hidden p-0.5 hover:scale-105 transition-transform bg-white"
                          >
                            <img src={method.qrCode} alt="QR Code" className="w-full h-full object-contain" />
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No QR Code</span>
                        )}
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          method.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {method.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditClick(method)}
                            className="p-2 text-gray-400 hover:text-luckoptics-primary hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                            title="Edit method"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(method._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete method"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
