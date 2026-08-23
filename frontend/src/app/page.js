'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Truck, Sparkles, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const categoryShapes = {
  'Eyeglasses': [
    {
      name: 'Square',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <rect x="5" y="5" width="35" height="20" rx="3" />
          <rect x="60" y="5" width="35" height="20" rx="3" />
          <path d="M40 15 Q50 10 60 15" />
        </svg>
      )
    },
    {
      name: 'Rectangle',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <rect x="5" y="7" width="38" height="16" rx="2" />
          <rect x="57" y="7" width="38" height="16" rx="2" />
          <path d="M43 15 Q50 10 57 15" />
        </svg>
      )
    },
    {
      name: 'Round',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <circle cx="23" cy="15" r="10" />
          <circle cx="77" cy="15" r="10" />
          <path d="M33 15 Q50 8 67 15" />
        </svg>
      )
    },
    {
      name: 'Geometric',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <polygon points="23,4 34,10 34,20 23,26 12,20 12,10" />
          <polygon points="77,4 88,10 88,20 77,26 66,20 66,10" />
          <path d="M34 15 Q50 8 66 15" />
        </svg>
      )
    }
  ],
  'Sunglasses': [
    {
      name: 'Aviator',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[1.5]">
          <path d="M 5,8 C 5,5 38,5 38,10 C 38,20 28,26 21,26 C 14,26 5,20 5,8 Z" />
          <path d="M 95,8 C 95,5 62,5 62,10 C 62,20 72,26 79,26 C 86,26 95,20 95,8 Z" />
          <path d="M 38,10 Q 50,7 62,10" />
          <path d="M 36,14 Q 50,11 64,14" />
        </svg>
      )
    },
    {
      name: 'Wayfarer',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <path d="M6,7 L38,9 C38,9 36,23 23,23 C10,23 7,16 6,7 Z" />
          <path d="M94,7 L62,9 C62,9 64,23 77,23 C90,23 93,16 94,7 Z" />
          <path d="M38,12 Q50,7 62,12" />
        </svg>
      )
    },
    {
      name: 'Round',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <circle cx="23" cy="15" r="10" />
          <circle cx="77" cy="15" r="10" />
          <path d="M33 15 Q50 8 67 15" />
        </svg>
      )
    },
    {
      name: 'Cat Eye',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <path d="M5,6 C5,6 38,9 36,17 C34,23 24,23 16,21 C8,19 5,6 5,6 Z" />
          <path d="M95,6 C95,6 62,9 64,17 C66,23 76,23 84,21 C92,19 95,6 95,6 Z" />
          <path d="M36,12 Q50,7 64,12" />
        </svg>
      )
    }
  ],
  'Screen Glasses': [
    {
      name: 'Wayfarer',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <path d="M6,7 L38,9 C38,9 36,23 23,23 C10,23 7,16 6,7 Z" />
          <path d="M94,7 L62,9 C62,9 64,23 77,23 C90,23 93,16 94,7 Z" />
          <path d="M38,12 Q50,7 62,12" />
        </svg>
      )
    },
    {
      name: 'Rectangle',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <rect x="5" y="7" width="38" height="16" rx="2" />
          <rect x="57" y="7" width="38" height="16" rx="2" />
          <path d="M43 15 Q50 10 57 15" />
        </svg>
      )
    },
    {
      name: 'Round',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <circle cx="23" cy="15" r="10" />
          <circle cx="77" cy="15" r="10" />
          <path d="M33 15 Q50 8 67 15" />
        </svg>
      )
    }
  ],
  'Kids Glasses': [
    {
      name: 'Round',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <circle cx="23" cy="15" r="10" />
          <circle cx="77" cy="15" r="10" />
          <path d="M33 15 Q50 8 67 15" />
        </svg>
      )
    },
    {
      name: 'Square',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <rect x="5" y="5" width="35" height="20" rx="3" />
          <rect x="60" y="5" width="35" height="20" rx="3" />
          <path d="M40 15 Q50 10 60 15" />
        </svg>
      )
    },
    {
      name: 'Geometric',
      svg: (
        <svg viewBox="0 0 100 30" className="w-10 h-4 stroke-current fill-none stroke-[2]">
          <polygon points="23,4 34,10 34,20 23,26 12,20 12,10" />
          <polygon points="77,4 88,10 88,20 77,26 66,20 66,10" />
          <path d="M34 15 Q50 8 66 15" />
        </svg>
      )
    }
  ]
};

const eyeglassesShapes = [
  {
    name: 'Rectangle',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/rectangle.webp',
    svg: (
      <svg viewBox="0 0 100 30" className="w-14 h-5 stroke-current fill-none stroke-[1.8] text-gray-400 group-hover:text-luckoptics-primary">
        <rect x="5" y="7" width="38" height="16" rx="2" />
        <rect x="57" y="7" width="38" height="16" rx="2" />
        <path d="M43 15 Q50 10 57 15" />
      </svg>
    )
  },
  {
    name: 'Cateye',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/cateye.webp',
    svg: (
      <svg viewBox="0 0 100 30" className="w-14 h-5 stroke-current fill-none stroke-[1.8] text-gray-400 group-hover:text-luckoptics-primary">
        <path d="M5,6 C5,6 38,9 36,17 C34,23 24,23 16,21 C8,19 5,6 5,6 Z" />
        <path d="M95,6 C95,6 62,9 64,17 C66,23 76,23 84,21 C92,19 95,6 95,6 Z" />
        <path d="M36,12 Q50,7 64,12" />
      </svg>
    )
  },
  {
    name: 'Aviator',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/aviator.webp',
    svg: (
      <svg viewBox="0 0 100 30" className="w-14 h-5 stroke-current fill-none stroke-[1.4] text-gray-400 group-hover:text-luckoptics-primary">
        <path d="M 5,8 C 5,5 38,5 38,10 C 38,20 28,26 21,26 C 14,26 5,20 5,8 Z" />
        <path d="M 95,8 C 95,5 62,5 62,10 C 62,20 72,26 79,26 C 86,26 95,20 95,8 Z" />
        <path d="M 38,10 Q 50,7 62,10" />
        <path d="M 36,14 Q 50,11 64,14" />
      </svg>
    )
  },
  {
    name: 'Geometric',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/geometric.webp',
    svg: (
      <svg viewBox="0 0 100 30" className="w-14 h-5 stroke-current fill-none stroke-[1.8] text-gray-400 group-hover:text-luckoptics-primary">
        <polygon points="23,4 34,10 34,20 23,26 12,20 12,10" />
        <polygon points="77,4 88,10 88,20 77,26 66,20 66,10" />
        <path d="M34 15 Q50 8 66 15" />
      </svg>
    )
  },
  {
    name: 'Round',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/round.webp',
    svg: (
      <svg viewBox="0 0 100 30" className="w-14 h-5 stroke-current fill-none stroke-[1.8] text-gray-400 group-hover:text-luckoptics-primary">
        <circle cx="23" cy="15" r="10" />
        <circle cx="77" cy="15" r="10" />
        <path d="M33 15 Q50 8 67 15" />
      </svg>
    )
  },
  {
    name: 'Clubmaster',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/clubmaster.webp',
    svg: (
      <svg viewBox="0 0 100 30" className="w-14 h-5 stroke-current fill-none stroke-[1.8] text-gray-400 group-hover:text-luckoptics-primary">
        <path d="M5,12 L38,13 C38,13 37,17 37,20 C37,24 30,26 21,26 C12,26 5,24 5,20 Z" />
        <path d="M95,12 L62,13 C62,13 63,17 63,20 C63,24 70,26 79,26 C88,26 95,24 95,20 Z" />
        <path d="M38,15 Q50,11 62,15" />
        <path d="M4,10 Q21,6 39,11" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M96,10 Q79,6 61,11" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'Square',
    image: 'https://ik.imagekit.io/bzdikkis8/glasses/square.webp',
    svg: (
      <svg viewBox="0 0 100 30" className="w-14 h-5 stroke-current fill-none stroke-[1.8] text-gray-400 group-hover:text-luckoptics-primary">
        <rect x="5" y="5" width="35" height="20" rx="3" />
        <rect x="60" y="5" width="35" height="20" rx="3" />
        <path d="M40 15 Q50 10 60 15" />
      </svg>
    )
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch(`${API_URL}/categories`);
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.categories);
        }

        const prodRes = await fetch(`${API_URL}/products?featured=true&limit=4`);
        const prodData = await prodRes.json();
        if (prodData.success) {
          setFeaturedProducts(prodData.products);
        }

        const sliderRes = await fetch(`${API_URL}/sliders`);
        const sliderData = await sliderRes.json();
        if (sliderData.success && sliderData.sliders.length > 0) {
          setSliders(sliderData.sliders);
        }
      } catch (err) {
        console.error('Failed to load API data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const fallbackCategories = [
    { name: 'Eyeglasses', image: 'https://ik.imagekit.io/bzdikkis8/glasses/eyeglasses-first-category.webp?updatedAt=1787246499354', slug: 'eyeglasses' },
    { name: 'Sunglasses', image: 'https://ik.imagekit.io/bzdikkis8/glasses/sunglasses-first-category.webp?updatedAt=1787246498793', slug: 'sunglasses' },
    { name: 'Screen Glasses', image: 'https://ik.imagekit.io/bzdikkis8/glasses/screenglasses-first-catergory.webp?updatedAt=1787246498926', slug: 'screen-glasses' },
    { name: 'Kids Glasses', image: 'https://ik.imagekit.io/bzdikkis8/glasses/kidsglasses-first-category.webp?updatedAt=1787246499294', slug: 'kids-glasses' }
  ];

  const fallbackProducts = [
    {
      _id: '1',
      name: 'Vincent Chase Black Full Rim Rectangle',
      price: 1500,
      discountPrice: 999,
      images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop'],
      shape: 'Rectangle',
      frameType: 'Full Rim',
      ratings: 4.8,
      stock: 15
    },
    {
      _id: '2',
      name: 'John Jacobs Golden Round Spectacles',
      price: 2500,
      discountPrice: 1999,
      images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&auto=format&fit=crop'],
      shape: 'Round',
      frameType: 'Full Rim',
      ratings: 4.6,
      stock: 5
    },
    {
      _id: '3',
      name: 'Vincent Chase Polarized Aviator Sunglasses',
      price: 1999,
      discountPrice: 1299,
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop'],
      shape: 'Aviator',
      frameType: 'Full Rim',
      ratings: 4.9,
      stock: 8
    },
    {
      _id: '4',
      name: 'LuckOptics Air Screen Matte Blue Light Blockers',
      price: 1200,
      discountPrice: 799,
      images: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&auto=format&fit=crop'],
      shape: 'Wayfarer',
      frameType: 'Full Rim',
      ratings: 4.7,
      stock: 12
    }
  ];

  // Slides matching the LuckOptics screenshot style & doctor theme
  const fallbackSliders = [
    {
      id: 'fallback-1',
      title: 'JOHN JACOBS',
      subtitle: 'ACTIVE CYCLING GLASSES',
      desc: 'Aerodynamic design with wrap-around lenses for maximum wind protection and optical clarity.',
      image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1000&auto=format&fit=crop',
      btnText: 'Explore Cycle Glasses',
      link: '/products?category=Sunglasses'
    },
    {
      id: 'fallback-2',
      title: 'DOCTOR RECOMMENDED',
      subtitle: 'BLUE SHIELD SCREEN PROTECT',
      desc: 'Formulated with clinical precision to block 98% harmful screen radiation. Perfect for digital eye strain.',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1000&auto=format&fit=crop',
      btnText: 'Explore Blue Blockers',
      link: '/products?category=Screen%20Glasses'
    },
    {
      id: 'fallback-3',
      title: 'VINCENT CHASE',
      subtitle: 'THE CLINICAL COMFORT SERENE',
      desc: 'Extra lightweight frames with soft hypoallergenic nose pads. Doctor recommended for high-power prescriptions.',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1000&auto=format&fit=crop',
      btnText: 'Shop Spectacles',
      link: '/products?category=Eyeglasses'
    },
    {
      id: 'fallback-4',
      title: 'POLARIZED SERIES',
      subtitle: 'PREMIUM POLARIZED SUNGLASSES',
      desc: 'Eliminate glare, enhance colors, and protect your eyes under intense sunlight with our specialized polarized range.',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&auto=format&fit=crop',
      btnText: 'Shop Polarized',
      link: '/products?category=Sunglasses'
    }
  ];

  const activeCategories = categories.length > 0 ? categories : fallbackCategories;
  const activeProducts = featuredProducts.length > 0 ? featuredProducts : fallbackProducts;
  const activeSlides = sliders.length > 0 ? sliders : fallbackSliders;

  // Slide auto-play effect
  useEffect(() => {
    const total = activeSlides.length;
    if (total <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === total - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. LuckOptics Screenshot Style Slider Section */}
      {loading ? (
        <section className="relative w-full h-[360px] sm:h-[480px] bg-luckoptics-dark flex items-center justify-center select-none">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading Banner...</span>
          </div>
        </section>
      ) : (
        <section className="relative w-full h-[360px] sm:h-[480px] bg-luckoptics-dark overflow-hidden select-none">
          
          {/* Slider Items wrapper */}
          <div className="w-full h-full relative">
            {activeSlides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <div
                  key={slide._id || slide.id}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 z-0 translate-x-12'
                  }`}
                >
                  {/* Background image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10"></div>
                  <img
                    src={slide.image}
                    alt={slide.subtitle}
                    className="w-full h-full object-cover object-center absolute inset-0"
                  />

                  {/* Content centered exactly matching LuckOptics screenshot layout */}
                  <div className="absolute inset-y-0 left-0 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center items-start z-20 space-y-4">
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest text-luckoptics-gold uppercase">
                      {slide.title}
                    </span>
                    <h2 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-white leading-tight uppercase tracking-wider max-w-lg">
                      {slide.subtitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 max-w-md font-medium leading-relaxed hidden sm:block">
                      {slide.desc}
                    </p>
                    <Link
                      href={slide.link}
                      className="inline-block bg-white text-luckoptics-dark font-sans font-extrabold text-xs sm:text-sm px-8 py-3 rounded-md hover:bg-luckoptics-primary hover:text-white transition-all shadow-lg mt-2"
                    >
                      {slide.btnText}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-25 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Previous Slide"
            suppressHydrationWarning
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-25 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Next Slide"
            suppressHydrationWarning
          >
            <ChevronRight size={20} />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-25">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'bg-white scale-120' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                suppressHydrationWarning
              ></button>
            ))}
          </div>
        </section>
      )}

      {/* 2. Top Categories (LuckOptics screenshot style header with shapes hover dropdown) */}
      <section className="max-w-7xl mx-auto px-4 relative">
        <div className="border-b border-gray-100 pb-3 mb-6">
          <h3 className="font-display font-extrabold text-lg text-luckoptics-dark uppercase tracking-wider">
            Top Categories
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {activeCategories.map((cat, i) => {
            const hasShapes = categoryShapes[cat.name];
            return (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group block p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-display font-bold text-sm text-gray-800 group-hover:text-luckoptics-primary transition-colors text-center">
                    {cat.name}
                  </h4>
                </Link>

                {/* Categories Shapes Hover Dropdown */}
                {hoveredCategory === cat.name && hasShapes && (
                  <div className="absolute top-[85%] left-1/2 -translate-x-1/2 mt-1 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150 text-gray-700">
                    <div className="space-y-1.5">
                      {categoryShapes[cat.name].map((shape) => (
                        <Link
                          key={shape.name}
                          href={`/products?category=${encodeURIComponent(cat.name)}&shape=${shape.name}`}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 hover:text-luckoptics-primary transition-colors text-xs font-bold"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-gray-400 group-hover:text-luckoptics-primary">{shape.svg}</span>
                            <span>{shape.name}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <hr className="border-gray-100 my-2.5" />
                    <Link
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="block text-center text-[10px] font-extrabold text-luckoptics-primary hover:underline uppercase tracking-wider"
                    >
                      View all shapes
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Full-Bleed LuckOptics Screenshot Style Wavy Banner */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-luckoptics-primary to-luckoptics-dark text-white py-16 md:py-24 mt-16 select-none">
        
        {/* Top Wave Swoop (Inward Curve, Seamless text-white) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[-1px] pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] md:h-[60px] text-white fill-current">
            <path d="M0,0 L1200,0 L1200,30 C900,120 300,120 0,30 Z"></path>
          </svg>
        </div>

        {/* Bottom Wave Swoop (Inward Curve, Seamless text-white) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[1px] pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] md:h-[60px] text-white fill-current">
            <path d="M0,120 L1200,120 L1200,90 C900,0 300,0 0,90 Z"></path>
          </svg>
        </div>

        {/* Glowing Background circles */}
        <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-luckoptics-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Centered Content grid wrapper */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-20 py-6">
          
          {/* Left Text details */}
          <div className="space-y-6 text-left">
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight text-white uppercase leading-none">
              FREE LENS <br />
              REPLACEMENT
            </h2>
            <p className="text-sm sm:text-lg text-gray-200 font-semibold tracking-wide mt-3">
              Any Frame | Any Power | Any Reason
            </p>
            
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-block bg-white text-luckoptics-dark hover:bg-gray-100 px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg transition-all"
              >
                Find Nearby Stores
              </Link>
            </div>

            <div className="space-y-1 pt-6 border-t border-white/10 max-w-sm">
              <p className="text-sm sm:text-lg font-extrabold text-white">Just pay ₹199 as Fitting Fee</p>
              <p className="text-[10px] sm:text-xs text-gray-300 font-medium">Get Premium Anti-Glare Lenses. Upgrades are available.</p>
            </div>
          </div>

          {/* Right glasses Image (ImageKit WebP) */}
          <div className="relative flex justify-center items-center h-64 md:h-80">
            <div className="absolute w-72 h-72 rounded-full bg-luckoptics-primary/20 blur-3xl pointer-events-none"></div>
            <img
              src="https://ik.imagekit.io/bzdikkis8/glasses/banner-image.webp"
              alt="LuckOptics Premium Eyewear Banner"
              className="max-h-72 md:max-h-80 w-full object-contain relative z-10 hover:scale-105 transition-transform duration-500 select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(14,165,233,0.2)]"
            />
          </div>
        </div>
      </section>

      {/* 3.5 Eyeglasses Shapes Selection Grid (LuckOptics style) */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="border-b border-gray-100 pb-3 mb-6">
          <h3 className="font-display font-extrabold text-lg text-luckoptics-dark uppercase tracking-wider">
            Get the perfect shape – Eyeglasses
          </h3>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-7 gap-6 text-center">
          {eyeglassesShapes.map((shape) => (
            <Link
              key={shape.name}
              href={`/products?category=Eyeglasses&shape=${encodeURIComponent(shape.name === 'Cateye' ? 'Cat Eye' : shape.name)}`}
              className="group flex flex-col items-center justify-center cursor-pointer"
            >
              {/* Circular Frame Container */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:border-luckoptics-primary group-hover:bg-white transition-all shadow-inner relative overflow-hidden">
                {/* Outline SVG Fallback */}
                <div className="absolute inset-0 flex items-center justify-center p-4.5 group-hover:scale-105 transition-transform duration-300">
                  {shape.svg}
                </div>
                {/* Image (Loads from ImageKit base once user uploads it) */}
                <img
                  src={shape.image}
                  alt={`${shape.name} shape eyeglasses`}
                  className="w-full h-full object-contain relative z-10 p-2 hidden group-hover:opacity-95 transition-opacity"
                  onLoad={(e) => {
                    e.target.classList.remove('hidden');
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-luckoptics-dark group-hover:text-luckoptics-primary mt-3.5 transition-colors uppercase tracking-wider">
                {shape.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Glasses Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-display font-extrabold text-lg text-luckoptics-dark uppercase tracking-wider">Trending Spec Collections</h3>
          </div>
          <Link href="/products" className="text-xs font-bold text-luckoptics-primary hover:underline flex items-center gap-1">
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse border border-gray-100 rounded-2xl p-4 bg-white h-72 flex flex-col justify-between">
                <div className="bg-gray-100 h-32 rounded-xl mb-4"></div>
                <div className="bg-gray-100 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-100 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {activeProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Trust Badges / Services */}
      <section className="bg-white border-y border-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-4 space-y-2">
            <div className="p-3 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
              <Shield size={24} />
            </div>
            <h4 className="font-display font-bold text-gray-800 text-sm">Clinical Lens Assurance</h4>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Every prescription lens is computerized and checked by certified optical engineers.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 space-y-2">
            <div className="p-3 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
              <Truck size={24} />
            </div>
            <h4 className="font-display font-bold text-gray-800 text-sm">Cash on Delivery (COD)</h4>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Free home shipping with flexible cash payment upon doorstep inspection.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 space-y-2">
            <div className="p-3 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
              <Clock size={24} />
            </div>
            <h4 className="font-display font-bold text-gray-800 text-sm">2-Year Prescription Guarantee</h4>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Any prescription error is covered under our 100% replacement warranty program.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
