'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, Eye, IndianRupee } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLenses() {
  const { token } = useAuth();

  const [lenses, setLenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    price: '',
    isPrescriptionRequired: true
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const loadLenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/lenses`);
      const data = await res.json();
      if (data.success) {
        setLenses(data.lenses);
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
        loadLenses();
      });
    }
  }, [token, loadLenses]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditClick = (lens) => {
    setEditingId(lens._id);
    setFormData({
      name: lens.name,
      desc: lens.desc,
      price: lens.price,
      isPrescriptionRequired: lens.isPrescriptionRequired
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    if (!formData.name || !formData.desc || formData.price === '') {
      setFormMsg({ type: 'error', text: 'All fields are required' });
      return;
    }

    try {
      const url = editingId ? `${API_URL}/lenses/${editingId}` : `${API_URL}/lenses`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price)
        })
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg({ type: 'success', text: editingId ? 'Lens option updated successfully!' : 'Lens option added successfully!' });
        setEditingId(null);
        setShowForm(false);
        setFormData({
          name: '',
          desc: '',
          price: '',
          isPrescriptionRequired: true
        });
        loadLenses();
      } else {
        setFormMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setFormMsg({ type: 'error', text: 'Connection failed' });
    }
  };

  const handleDeleteClick = async (lensId) => {
    if (confirm('Are you sure you want to delete this lens option?')) {
      try {
        const res = await fetch(`${API_URL}/lenses/${lensId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          loadLenses();
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
          <h2 className="font-display font-black text-2xl text-luckoptics-dark leading-tight">Lens Options & Pricing</h2>
          <p className="text-xs text-gray-500 mt-1">Configure user-selectable lens types, descriptions and prices for prescription glasses.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', desc: '', price: '', isPrescriptionRequired: true });
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-luckoptics-primary text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-luckoptics-primary/95 transition-all shadow-md cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Lens Type</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-lg space-y-4 max-w-xl">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-display font-bold text-sm text-luckoptics-dark uppercase tracking-wider">
              {editingId ? 'Edit Lens Option' : 'New Lens Option'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Lens Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Zero Power"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-hidden"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Price (₹)</label>
              <div className="relative flex items-center">
                <IndianRupee size={14} className="absolute left-3 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  placeholder="e.g. 500"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-3 text-xs focus:outline-hidden font-semibold text-gray-800"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Description</label>
            <input
              type="text"
              name="desc"
              required
              placeholder="e.g. Distance or Reading power lenses"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-hidden"
              value={formData.desc}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="isPrescriptionRequired"
              id="isPrescriptionRequired"
              className="w-4 h-4 text-luckoptics-primary focus:ring-luckoptics-primary border-gray-300 rounded-md"
              checked={formData.isPrescriptionRequired}
              onChange={handleInputChange}
            />
            <label htmlFor="isPrescriptionRequired" className="text-xs font-bold text-gray-700 cursor-pointer">
              Requires prescription power table (SPH, CYL, AXIS)
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
              {editingId ? 'Save Changes' : 'Create Option'}
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
                  <th className="p-5">Lens Type</th>
                  <th className="p-5">Description</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Prescription Required?</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 font-semibold">
                      No lens options configured.
                    </td>
                  </tr>
                ) : (
                  lenses.map((lens) => (
                    <tr key={lens._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-2 bg-luckoptics-primary/5 text-luckoptics-primary rounded-xl">
                          <Eye size={14} />
                        </div>
                        <span>{lens.name}</span>
                      </td>
                      <td className="p-5 text-gray-500 leading-normal max-w-xs truncate">{lens.desc}</td>
                      <td className="p-5 font-bold text-luckoptics-primary">
                        {lens.price === 0 ? 'Free' : `₹${lens.price}`}
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          lens.isPrescriptionRequired ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {lens.isPrescriptionRequired ? 'Yes (Sph, Cyl, Ax)' : 'No (Plano/Zero Power)'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditClick(lens)}
                            className="p-2 text-gray-400 hover:text-luckoptics-primary hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                            title="Edit option"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(lens._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete option"
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
