'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminCategories() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
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
        loadCategories();
      });
    }
  }, [token, loadCategories]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ImageKit client-side uploading for category icon/banners
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
      uploadPayload.append('folder', '/categories');

      const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: uploadPayload
      });
      const ikData = await ikRes.json();

      if (ikData.url) {
        setFormData(prev => ({ ...prev, image: ikData.url }));
        setFormMsg({ type: 'success', text: 'Category image uploaded!' });
      } else {
        throw new Error(ikData.message || 'ImageKit upload failed');
      }
    } catch (err) {
      console.error(err);
      const randomId = Math.floor(Math.random() * 100);
      const mockUrl = `https://picsum.photos/id/${randomId}/400/400`;
      setFormData(prev => ({ ...prev, image: mockUrl }));
      setFormMsg({ type: 'error', text: 'ImageKit keys unconfigured. Used mock placeholder image for visual display.' });
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleEditClick = (cat) => {
    setEditingId(cat._id);
    setFormData({ name: cat.name, description: cat.description, image: cat.image });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    if (!formData.image) {
      setFormMsg({ type: 'error', text: 'Category image banner is required' });
      return;
    }

    try {
      const url = editingId ? `${API_URL}/categories/${editingId}` : `${API_URL}/categories`;
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
        setFormMsg({ type: 'success', text: editingId ? 'Category updated!' : 'Category created!' });
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', description: '', image: '' });
        loadCategories();
      } else {
        setFormMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setFormMsg({ type: 'error', text: 'Connection failed' });
    }
  };

  const handleDeleteClick = async (catId) => {
    if (confirm('Are you sure you want to delete this product category?')) {
      try {
        const res = await fetch(`${API_URL}/categories/${catId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          loadCategories();
        } else {
          alert('Delete blocked: ' + data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-black text-2xl text-luckoptics-dark leading-none">Manage Categories</h2>
          <p className="text-xs text-gray-500 mt-1">Configure eyewear categories and banners</p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '', image: '' });
            setFormMsg({ type: '', text: '' });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-1.5 bg-luckoptics-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-luckoptics-primary/95 transition-all cursor-pointer"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Close Form' : 'Add Category'}</span>
        </button>
      </div>

      {/* Form overlay */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 max-w-xl">
          <h3 className="font-display font-bold text-base text-luckoptics-dark border-b border-gray-50 pb-3">
            {editingId ? 'Edit Product Category' : 'Create Category Entry'}
          </h3>

          {formMsg.text && (
            <div className={`p-4 rounded-xl border text-xs font-semibold ${
              formMsg.type === 'success' ? 'bg-green-50 border-green-200/50 text-green-700' : 'bg-red-50 border-red-200/50 text-red-700'
            }`}>
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Category Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Eyeglasses"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Description Summary</label>
              <textarea
                name="description"
                required
                rows="3"
                placeholder="Briefly summarize what this collection represents"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase">Banner Thumbnail</label>
              <div className="flex gap-4 items-center">
                <label className="w-16 h-16 border-2 border-dashed border-gray-200 hover:border-luckoptics-primary rounded-xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 text-gray-400">
                  {imageUploadLoading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-luckoptics-primary"></span>
                  ) : (
                    <ImageIcon size={18} />
                  )}
                  <input type="file" className="hidden" onChange={handleImageFileChange} disabled={imageUploadLoading} />
                </label>

                {formData.image && (
                  <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden p-1 flex items-center justify-center">
                    <img src={formData.image} alt="preview icon" className="max-h-full max-w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-5 py-2.5 text-xs font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold bg-luckoptics-primary text-white rounded-xl shadow-md hover:bg-luckoptics-primary/95"
              >
                {editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="bg-white h-40 border border-gray-100 rounded-3xl animate-pulse"></div>)
        ) : categories.length === 0 ? (
          <div className="sm:col-span-3 text-center py-10 bg-white rounded-3xl border border-gray-100 text-xs text-gray-400">
            No categories configured. Create one to begin.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="bg-white border border-gray-100 p-5 rounded-3xl flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-800 text-sm leading-none">{cat.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-gray-50 pt-3.5 mt-4">
                <button
                  onClick={() => handleEditClick(cat)}
                  className="p-1.5 hover:bg-gray-50 text-gray-500 hover:text-luckoptics-primary rounded-lg border border-transparent hover:border-gray-100 transition-all cursor-pointer"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDeleteClick(cat._id)}
                  className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
