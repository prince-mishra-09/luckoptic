'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminProducts() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    images: [],
    shape: 'Rectangle',
    material: 'Acetate',
    frameType: 'Full Rim',
    gender: 'Men',
    color: '',
    size: 'Medium',
    featured: false
  });

  // Image upload state
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const catRes = await fetch(`${API_URL}/categories`);
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories);
        // Set default category in form
        if (catData.categories.length > 0) {
          setFormData(prev => ({ ...prev, category: catData.categories[0]._id }));
        }
      }

      const prodRes = await fetch(`${API_URL}/products?limit=100`);
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products);
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
        loadData();
      });
    }
  }, [token, loadData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      uploadPayload.append('folder', '/products');

      // 3. Upload directly to ImageKit API
      const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: uploadPayload
      });
      const ikData = await ikRes.json();

      if (ikData.url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ikData.url]
        }));
        setFormMsg({ type: 'success', text: 'Image uploaded successfully to ImageKit!' });
      } else {
        throw new Error(ikData.message || 'ImageKit rejected upload');
      }
    } catch (err) {
      console.error(err);
      // Fallback placeholder during development if keys are unconfigured
      const randomId = Math.floor(Math.random() * 1000);
      const mockUrl = `https://picsum.photos/id/${randomId}/500/300`;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, mockUrl]
      }));
      setFormMsg({ type: 'error', text: 'ImageKit keys unconfigured. Used mock placeholder image for visual display.' });
    } finally {
      setImageUploadLoading(false);
    }
  };

  const removeUploadedImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category?._id || product.category || '',
      stock: product.stock,
      images: product.images,
      shape: product.shape,
      material: product.material,
      frameType: product.frameType,
      gender: product.gender,
      color: product.color,
      size: product.size,
      featured: product.featured || false
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    if (formData.images.length === 0) {
      setFormMsg({ type: 'error', text: 'Please upload at least one image' });
      return;
    }

    try {
      const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
          stock: Number(formData.stock)
        })
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg({ type: 'success', text: editingId ? 'Product updated successfully!' : 'Product added successfully!' });
        setEditingId(null);
        setShowForm(false);
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          discountPrice: '',
          category: categories[0]?._id || '',
          stock: '',
          images: [],
          shape: 'Rectangle',
          material: 'Acetate',
          frameType: 'Full Rim',
          gender: 'Men',
          color: '',
          size: 'Medium',
          featured: false
        });
        loadData();
      } else {
        setFormMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setFormMsg({ type: 'error', text: 'Connection failed' });
    }
  };

  const handleDeleteClick = async (productId) => {
    if (confirm('Are you sure you want to delete this product frame?')) {
      try {
        const res = await fetch(`${API_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          loadData();
        } else {
          alert('Delete failed: ' + data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: Number(newStock) })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: Number(newStock) } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-black text-2xl text-luckoptics-dark leading-none">Manage Products</h2>
          <p className="text-xs text-gray-500 mt-1">Configure frames catalog, specifications, and upload images</p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              discountPrice: '',
              category: categories[0]?._id || '',
              stock: '',
              images: [],
              shape: 'Rectangle',
              material: 'Acetate',
              frameType: 'Full Rim',
              gender: 'Men',
              color: '',
              size: 'Medium',
              featured: false
            });
            setFormMsg({ type: '', text: '' });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-1.5 bg-luckoptics-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-luckoptics-primary/95 transition-all cursor-pointer"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Close Form' : 'Add New Frame'}</span>
        </button>
      </div>

      {/* CRUD Form overlay */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <h3 className="font-display font-bold text-base text-luckoptics-dark border-b border-gray-50 pb-3">
            {editingId ? 'Edit Product Frame' : 'Create Product Entry'}
          </h3>

          {formMsg.text && (
            <div className={`p-4 rounded-xl border text-xs font-semibold ${
              formMsg.type === 'success' ? 'bg-green-50 border-green-200/50 text-green-700' : 'bg-red-50 border-red-200/50 text-red-700'
            }`}>
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Basic Fields */}
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Product Title / Model Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Vincent Chase Black Full Rim Rectangle"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Detailed Description</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    placeholder="Provide information on lens quality, design detail, and frame dimensions"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Retail Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-hidden"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Discounted Price (₹) (Optional)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-hidden"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Initial Stock Count</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-hidden"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-hidden"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications Details */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 text-xs">
              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1.5">Frame Shape</label>
                <select name="shape" className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden" value={formData.shape} onChange={handleInputChange}>
                  {['Rectangle', 'Square', 'Round', 'Aviator', 'Wayfarer', 'Cat Eye', 'Oval'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1.5">Material</label>
                <select name="material" className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden" value={formData.material} onChange={handleInputChange}>
                  {['Acetate', 'Metal', 'TR90', 'Plastic', 'Titanium'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1.5">Frame Type</label>
                <select name="frameType" className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden" value={formData.frameType} onChange={handleInputChange}>
                  {['Full Rim', 'Half Rim', 'Rimless'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1.5">Target Gender</label>
                <select name="gender" className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden" value={formData.gender} onChange={handleInputChange}>
                  {['Men', 'Women', 'Unisex', 'Kids'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1.5">Color</label>
                <input type="text" name="color" required placeholder="e.g. Matte Black" className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden" value={formData.color} onChange={handleInputChange} />
              </div>

              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1.5">Size</label>
                <select name="size" className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden" value={formData.size} onChange={handleInputChange}>
                  {['Small', 'Medium', 'Wide'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {/* Image Manager */}
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-gray-500 uppercase">Product Image Gallery (Min 1 Image)</label>
              
              <div className="flex flex-wrap gap-4 items-center">
                {/* Upload Trigger button */}
                <label className="w-24 h-24 border-2 border-dashed border-gray-200 hover:border-luckoptics-primary rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 text-gray-400 transition-colors">
                  {imageUploadLoading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-luckoptics-primary"></span>
                  ) : (
                    <>
                      <ImageIcon size={20} />
                      <span className="text-[10px] font-bold mt-1">Upload</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} disabled={imageUploadLoading} />
                </label>

                {/* Uploaded Thumbnails list */}
                {formData.images.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 bg-gray-50 border border-gray-200 rounded-2xl p-1 flex items-center justify-center">
                    <img src={url} alt={`product frame preview ${i}`} className="max-h-full max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(i)}
                      className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Selection */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                className="w-4 h-4 text-luckoptics-primary focus:ring-luckoptics-primary border-gray-300 rounded-md"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured" className="text-xs font-bold text-gray-700">Display on Home Page Featured Collection</label>
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
                {editingId ? 'Save Changes' : 'Create Product Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Listing */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search products by title..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-hidden"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <th className="p-3">Thumbnail</th>
                <th className="p-3">Title</th>
                <th className="p-3">Shape / Material</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock level</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50">
                  <td className="p-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-contain bg-gray-50 rounded border border-gray-100 p-0.5" />
                  </td>
                  <td className="p-3 font-semibold text-gray-800 pr-4">
                    <span className="line-clamp-1">{p.name}</span>
                    <span className="text-[9px] text-luckoptics-primary font-bold uppercase tracking-wider block mt-0.5">{p.category?.name || 'Glasses'}</span>
                  </td>
                  <td className="p-3 text-gray-500">{p.shape} | {p.material}</td>
                  <td className="p-3 font-bold text-gray-700 font-sans">
                    ₹{p.discountPrice || p.price}
                    {p.discountPrice && <span className="text-[9px] text-gray-400 line-through block font-medium">₹{p.price}</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className="w-14 bg-gray-50 border border-gray-200 rounded p-1 text-center focus:outline-hidden"
                        defaultValue={p.stock}
                        onBlur={(e) => handleStockUpdate(p._id, e.target.value)}
                      />
                      {p.stock <= 5 && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Low stock warning"></span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-luckoptics-primary rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p._id)}
                      className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
