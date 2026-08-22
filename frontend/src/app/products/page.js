'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, RotateCcw, ChevronDown, Check } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

function ProductListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  // Read current filters from URL params
  const activeCategory = searchParams.get('category') || '';
  const activeGender = searchParams.get('gender') || '';
  const activeShape = searchParams.get('shape') || '';
  const activeMaterial = searchParams.get('material') || '';
  const activeFrameType = searchParams.get('frameType') || '';
  const activeSearch = searchParams.get('search') || '';
  const activeSort = searchParams.get('sort') || '';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Load Categories
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, [API_URL]);

  useEffect(() => {
    // Load Products with filters
    async function loadProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        const res = await fetch(`${API_URL}/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          setTotalProducts(data.pagination?.total || data.products.length);
          
          // Restore scroll position
          const savedScroll = sessionStorage.getItem(`scroll_${queryParams.toString()}`);
          if (savedScroll) {
            setTimeout(() => {
              window.scrollTo(0, parseInt(savedScroll, 10));
            }, 100);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchParams, API_URL]);

  // Save scroll position when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const queryParams = new URLSearchParams(searchParams);
      sessionStorage.setItem(`scroll_${queryParams.toString()}`, window.scrollY.toString());
    };
    
    let timeoutId;
    const debouncedScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedScroll);
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page to 1 on filter update
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  const shapes = ['Rectangle', 'Square', 'Round', 'Aviator', 'Wayfarer', 'Cat Eye', 'Oval'];
  const materials = ['Metal', 'Acetate', 'TR90', 'Plastic', 'Titanium'];
  const frameTypes = ['Full Rim', 'Half Rim', 'Rimless'];
  const genders = ['Men', 'Women', 'Unisex', 'Kids'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="font-display font-black text-2xl text-luckoptics-dark uppercase tracking-tight">
            {activeCategory || 'All Eyewear'} Collection
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Showing {products.length} of {totalProducts} premium frames
            {activeSearch && ` matching "${activeSearch}"`}
          </p>
        </div>

        {/* Sort and Mobile Filters */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="flex items-center gap-1 text-xs text-gray-500 font-bold uppercase mr-1">
            <SlidersHorizontal size={14} />
            <span>Sort By:</span>
          </div>
          <select
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-hidden"
            value={activeSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            <option value="">Featured</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="ratings">Top Rated</option>
          </select>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1 bg-luckoptics-primary text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block bg-white p-5 rounded-2xl border border-gray-100 shadow-xs h-fit space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="font-display font-bold text-sm text-luckoptics-dark uppercase">Filters</span>
            <button onClick={clearAllFilters} className="text-[10px] text-red-500 font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
              <RotateCcw size={10} />
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Category</h4>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', activeCategory === cat.name ? '' : cat.name)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                    activeCategory === cat.name
                      ? 'bg-luckoptics-primary/15 text-luckoptics-primary font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {activeCategory === cat.name && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Gender</h4>
            <div className="space-y-1.5">
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => updateFilter('gender', activeGender === g ? '' : g)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                    activeGender === g
                      ? 'bg-luckoptics-primary/15 text-luckoptics-primary font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{g}</span>
                  {activeGender === g && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Shapes */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Frame Shape</h4>
            <div className="space-y-1.5">
              {shapes.map((s) => (
                <button
                  key={s}
                  onClick={() => updateFilter('shape', activeShape === s ? '' : s)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                    activeShape === s
                      ? 'bg-luckoptics-primary/15 text-luckoptics-primary font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{s}</span>
                  {activeShape === s && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Type */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Frame Type</h4>
            <div className="space-y-1.5">
              {frameTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => updateFilter('frameType', activeFrameType === t ? '' : t)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                    activeFrameType === t
                      ? 'bg-luckoptics-primary/15 text-luckoptics-primary font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{t}</span>
                  {activeFrameType === t && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Material</h4>
            <div className="space-y-1.5">
              {materials.map((m) => (
                <button
                  key={m}
                  onClick={() => updateFilter('material', activeMaterial === m ? '' : m)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                    activeMaterial === m
                      ? 'bg-luckoptics-primary/15 text-luckoptics-primary font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{m}</span>
                  {activeMaterial === m && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid List */}
        <section className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-80 border border-gray-100 p-4 flex flex-col justify-between">
                  <div className="bg-gray-100 h-36 rounded-xl"></div>
                  <div className="bg-gray-100 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-100 h-4 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-gray-100 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
              <span className="text-gray-300 font-black text-6xl select-none mb-3">:(</span>
              <h3 className="font-display font-bold text-gray-800 text-lg mb-1">No products match your filters</h3>
              <p className="text-xs text-gray-400 mb-6">Try refining your selection options or search criteria.</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-luckoptics-primary text-white font-bold text-xs rounded-full shadow-md hover:bg-luckoptics-primary/95 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Drawer Filters */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-white h-full p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="font-display font-bold text-sm text-luckoptics-dark">Filters</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-grow overflow-y-auto py-4 space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter('category', activeCategory === cat.name ? '' : cat.name)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        activeCategory === cat.name
                          ? 'bg-luckoptics-primary border-luckoptics-primary text-white font-bold'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Gender</h4>
                <div className="flex flex-wrap gap-2">
                  {genders.map((g) => (
                    <button
                      key={g}
                      onClick={() => updateFilter('gender', activeGender === g ? '' : g)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        activeGender === g
                          ? 'bg-luckoptics-primary border-luckoptics-primary text-white font-bold'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Shape */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Shape</h4>
                <div className="flex flex-wrap gap-2">
                  {shapes.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter('shape', activeShape === s ? '' : s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        activeShape === s
                          ? 'bg-luckoptics-primary border-luckoptics-primary text-white font-bold'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  clearAllFilters();
                  setShowMobileFilters(false);
                }}
                className="w-1/2 py-2 text-xs font-semibold border border-gray-200 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-1/2 py-2 text-xs font-bold bg-luckoptics-primary text-white rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductList() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="md:col-span-3 grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    }>
      <ProductListContent />
    </Suspense>
  );
}
