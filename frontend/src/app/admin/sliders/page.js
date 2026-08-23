'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, Image as ImageIcon, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSliders() {
  const { token } = useAuth();

  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    desc: '',
    image: '',
    btnText: 'Shop Now',
    link: '/products',
    order: '0'
  });

  // Image upload state
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const loadSliders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/sliders`);
      const data = await res.json();
      if (data.success) {
        setSliders(data.sliders);
      }
    } catch (err) {
      console.error('Failed to load sliders:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (token) {
      loadSliders();
    }
  }, [token, loadSliders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Direct ImageKit client-side uploading
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploadLoading(true);
    setFormMsg({ type: '', text: '' });

    try {
      // 1. Fetch authentication parameters from backend
      const authRes = await fetch(`${API_URL}/upload/auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const authData = await authRes.json();
      
      if (!authData.signature) {
        throw new Error('ImageKit upload authentication parameters failed');
      }

      // 2. Prepare upload payload for ImageKit
      const uploadPayload = new FormData();
      uploadPayload.append('file', file);
      uploadPayload.append('fileName', file.name);
      uploadPayload.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'your_imagekit_public_key');
      uploadPayload.append('signature', authData.signature);
      uploadPayload.append('expire', authData.expire.toString());
      uploadPayload.append('token', authData.token);
      uploadPayload.append('folder', '/sliders');

      // 3. Upload directly to ImageKit API
      const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: uploadPayload
      });
      const ikData = await ikRes.json();

      if (ikData.url) {
        setFormData(prev => ({
          ...prev,
          image: ikData.url
        }));
        setFormMsg({ type: 'success', text: 'Slider image uploaded successfully!' });
      } else {
        throw new Error(ikData.message || 'ImageKit rejected upload');
      }
    } catch (err) {
      console.error(err);
      // Fallback placeholder during development if keys are unconfigured
      const randomId = Math.floor(Math.random() * 1000);
      const mockUrl = `https://picsum.photos/id/${randomId}/1000/480`;
      setFormData(prev => ({
        ...prev,
        image: mockUrl
      }));
      setFormMsg({ type: 'error', text: 'ImageKit keys unconfigured. Used mock placeholder image for visual display.' });
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleEditClick = (slider) => {
    setEditingId(slider._id);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      desc: slider.desc,
      image: slider.image,
      btnText: slider.btnText || 'Shop Now',
      link: slider.link || '/products',
      order: slider.order.toString()
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    if (!formData.image) {
      setFormMsg({ type: 'error', text: 'Please upload or provide a slide image URL' });
      return;
    }

    try {
      const url = editingId ? `${API_URL}/sliders/${editingId}` : `${API_URL}/sliders`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order) || 0
        })
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg({ type: 'success', text: editingId ? 'Slide updated successfully!' : 'Slide added successfully!' });
        setEditingId(null);
        setShowForm(false);
        // Reset form
        setFormData({
          title: '',
          subtitle: '',
          desc: '',
          image: '',
          btnText: 'Shop Now',
          link: '/products',
          order: '0'
        });
        loadSliders();
      } else {
        setFormMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setFormMsg({ type: 'error', text: 'Connection failed' });
    }
  };

  const handleDeleteClick = async (sliderId) => {
    if (confirm('Are you sure you want to delete this hero slide?')) {
      try {
        const res = await fetch(`${API_URL}/sliders/${sliderId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          loadSliders();
        } else {
          alert('Delete failed: ' + data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMoveOrder = async (slider, direction) => {
    const currentIdx = sliders.findIndex(s => s._id === slider._id);
    if (currentIdx === -1) return;

    let targetIdx = currentIdx + direction;
    if (targetIdx < 0 || targetIdx >= sliders.length) return;

    const targetSlider = sliders[targetIdx];

    // Swap orders locally and push updates to backend
    try {
      const tempOrder = slider.order;
      const newTargetOrder = tempOrder;
      const newCurrentOrder = targetSlider.order;

      // Update current slider order
      await fetch(`${API_URL}/sliders/${slider._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: newCurrentOrder })
      });

      // Update target slider order
      await fetch(`${API_URL}/sliders/${targetSlider._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: newTargetOrder })
      });

      loadSliders();
    } catch (err) {
      console.error('Failed to update orders:', err);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black font-display text-luckoptics-dark tracking-tight">
            Manage Homepage Sliders
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Customize top-banner carousel images, tags, headings, descriptions, buttons and link redirects.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: '',
                subtitle: '',
                desc: '',
                image: '',
                btnText: 'Shop Now',
                link: '/products',
                order: (sliders.length + 1).toString()
              });
              setFormMsg({ type: '', text: '' });
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-luckoptics-primary hover:bg-luckoptics-primary/95 text-white font-sans font-bold text-xs py-3 px-5 rounded-xl shadow-lg hover:shadow-luckoptics-primary/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Slide</span>
          </button>
        )}
      </div>

      {/* Slide Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h3 className="font-display font-black text-lg text-luckoptics-dark">
              {editingId ? 'Edit Hero Slide' : 'Add New Hero Slide'}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {formMsg.text && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold ${
                  formMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {formMsg.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Left Col: Text Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Tag / Brand Title (e.g. JOHN JACOBS)
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter slide small tag title"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-luckoptics-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Slide Heading Subtitle (e.g. ACTIVE CYCLING GLASSES)
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    required
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Enter slide big bold subtitle"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-luckoptics-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Slide Description Text
                  </label>
                  <textarea
                    name="desc"
                    required
                    rows="3"
                    value={formData.desc}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the banner offer/product line"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-luckoptics-primary focus:outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="btnText"
                      value={formData.btnText}
                      onChange={handleInputChange}
                      placeholder="Shop Now"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-luckoptics-primary focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Display Order (Number)
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-luckoptics-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Button Redirect URL / Link
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="/products?category=Sunglasses"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-luckoptics-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Form Right Col: Slider Image upload */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Banner Background Image
                  </span>

                  <div className="flex flex-col gap-4">
                    {/* Image Preview Box */}
                    <div className="w-full aspect-[21/9] border border-dashed border-gray-200 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center relative">
                      {formData.image ? (
                        <>
                          <img
                            src={formData.image}
                            alt="Slider preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-all cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <ImageIcon size={32} strokeWidth={1.5} />
                          <span className="text-[10px] font-medium">No Banner Image Chosen</span>
                        </div>
                      )}
                    </div>

                    {/* Image URL Input & File Upload */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1">
                          Paste Direct Image URL
                        </label>
                        <input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-luckoptics-primary focus:outline-none transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex-grow flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3 px-4 rounded-xl cursor-pointer transition-colors">
                          <ImageIcon size={14} />
                          <span>{imageUploadLoading ? 'Uploading...' : 'Upload New File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            disabled={imageUploadLoading}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={imageUploadLoading}
                    className="flex-grow bg-luckoptics-primary hover:bg-luckoptics-primary/95 text-white font-sans font-bold text-xs py-3.5 rounded-xl shadow-lg hover:shadow-luckoptics-primary/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingId ? 'Save Changes' : 'Create Slide'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-bold text-xs py-3.5 px-6 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Sliders List View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luckoptics-primary"></div>
          <span className="text-xs text-gray-500 font-bold">Fetching sliders...</span>
        </div>
      ) : sliders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-md">
          <div className="text-gray-300 flex justify-center mb-4">
            <ImageIcon size={48} strokeWidth={1.5} />
          </div>
          <h4 className="font-display font-black text-base text-luckoptics-dark">No slides available</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
            There are currently no banner slides in your database. Click the "Add New Slide" button to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider px-2">
            <span>Hero Slider List ({sliders.length} active slides)</span>
            <span>Display Sequence</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sliders.map((slider, idx) => (
              <div
                key={slider._id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-stretch"
              >
                {/* Slide Thumbnail */}
                <div className="w-full md:w-64 aspect-[21/9] md:aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden relative flex-shrink-0">
                  <img
                    src={slider.image}
                    alt={slider.subtitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-md">
                    Order: {slider.order}
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-grow flex flex-col justify-between py-1 gap-4 md:gap-0">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold text-luckoptics-gold tracking-widest uppercase">
                        {slider.title || 'TAGLINE'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMoveOrder(slider, -1)}
                          disabled={idx === 0}
                          className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(slider, 1)}
                          disabled={idx === sliders.length - 1}
                          className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-display font-black text-sm text-luckoptics-dark uppercase tracking-wide mt-1">
                      {slider.subtitle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {slider.desc}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-50 mt-2">
                    <div className="flex items-center gap-4">
                      {slider.link && (
                        <a
                          href={slider.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] font-bold text-luckoptics-primary hover:underline"
                        >
                          <span>Redirects: {slider.link}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                      <span className="text-[10px] font-bold text-gray-400">
                        Btn Text: "{slider.btnText || 'Shop Now'}"
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(slider)}
                        className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-sans font-bold text-xs py-2 px-4 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(slider._id)}
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100/80 text-red-600 font-sans font-bold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
