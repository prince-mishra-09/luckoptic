import React from 'react';
import { Shield, Users, Target, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Hero Banner */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-luckoptics-dark leading-tight">
          Bringing Quality Eyewear to Your Neighborhood
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          At LuckOptics, we believe that high-quality vision shouldn&apos;t come with a high price tag. For years, we have served the Lucknow community with precision lens craft and trending fashion.
        </p>
      </section>

      {/* Showcase Image / Text Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-50 shadow-xs">
        <img
          src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop"
          alt="Optician testing lenses"
          className="rounded-2xl h-80 w-full object-cover"
        />
        <div className="space-y-4 text-left">
          <h3 className="font-display font-bold text-xl text-luckoptics-dark">Our Legacy of Trust & Vision Care</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Founded with a small retail outlet, LuckOptics has grown to become Lucknow&apos;s preferred destination for family eye care. We specialize in custom-tailored progressive lenses, computer glasses that reduce digital eye strain, and stylish sunglasses that guard against harsh UV radiation.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every lens is carefully ground and inspected using computerized calibration tools to ensure your exact prescription power matches perfectly. Your comfort and visual health are our primary guidelines.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-8 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="font-display font-bold text-xl text-luckoptics-dark">What Drives Our Store</h3>
          <p className="text-sm text-gray-500">The pillars of our service commitment</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { icon: <Shield className="text-luckoptics-primary" size={24} />, title: 'Premium Quality', desc: 'Certified anti-glare, dust, and scratch coatings applied on premium hard-resin lens materials.' },
            { icon: <Users className="text-luckoptics-primary" size={24} />, title: 'Customer First', desc: 'Free face-shape frame consultation at our Lucknow store to match your look.' },
            { icon: <Target className="text-luckoptics-primary" size={24} />, title: 'Zero Error Calibration', desc: 'Exact digital fitting of pupil center and PD distance to guarantee natural vision.' },
            { icon: <Award className="text-luckoptics-primary" size={24} />, title: 'Local Heritage', desc: 'A proud local business dedicated to providing jobs and trusted support to Lucknow.' }
          ].map((val, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-luckoptics-primary/10 rounded-xl mb-1">{val.icon}</div>
              <h4 className="font-display font-bold text-sm text-gray-800">{val.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
