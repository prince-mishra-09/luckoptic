import React from 'react';
import Link from 'next/link';
import { Glasses, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-luckoptics-dark text-white border-t border-luckoptics-primary/20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* About LuckOptics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1.5 bg-white/10 rounded-lg text-white">
              <Glasses size={20} className="text-luckoptics-gold" />
            </span>
            <span className="font-display font-bold text-lg text-white">LuckOptics</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            LuckOptics is Lucknow&apos;s trusted destination for premium eyewear, offering computer glasses, designer sunglasses, and customized prescription eyeglasses at local affordable prices.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 hover:bg-luckoptics-gold hover:text-luckoptics-dark rounded-full transition-colors text-gray-400">
              <Facebook size={16} />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-luckoptics-gold hover:text-luckoptics-dark rounded-full transition-colors text-gray-400">
              <Instagram size={16} />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-luckoptics-gold hover:text-luckoptics-dark rounded-full transition-colors text-gray-400">
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 border-b border-white/10 pb-2">Product Categories</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/products?category=Eyeglasses" className="hover:text-luckoptics-gold transition-colors">Eyeglasses</Link>
            </li>
            <li>
              <Link href="/products?category=Sunglasses" className="hover:text-luckoptics-gold transition-colors">Sunglasses</Link>
            </li>
            <li>
              <Link href="/products?category=Screen Glasses" className="hover:text-luckoptics-gold transition-colors">Computer Glasses</Link>
            </li>
            <li>
              <Link href="/products?category=Kids Glasses" className="hover:text-luckoptics-gold transition-colors">Kids Eyewear</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 border-b border-white/10 pb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/about" className="hover:text-luckoptics-gold transition-colors">About Our Business</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-luckoptics-gold transition-colors">Contact & Enquiries</Link>
            </li>
            <li>
              <Link href="/legal#privacy" className="hover:text-luckoptics-gold transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/legal#terms" className="hover:text-luckoptics-gold transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/legal#disclaimer" className="hover:text-luckoptics-gold transition-colors">Disclaimer</Link>
            </li>
            <li>
              <Link href="/legal#refunds" className="hover:text-luckoptics-gold transition-colors">Refund Policy</Link>
            </li>
          </ul>
        </div>

        {/* Support & Help */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 border-b border-white/10 pb-2">Support & Help</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/support#faq" className="hover:text-luckoptics-gold transition-colors">FAQs</Link>
            </li>
            <li>
              <Link href="/support#customer-services" className="hover:text-luckoptics-gold transition-colors">Customer Services</Link>
            </li>
            <li>
              <Link href="/support#shipping-delivery" className="hover:text-luckoptics-gold transition-colors">Shipping & Delivery</Link>
            </li>
            <li>
              <Link href="/support#returns-replacements" className="hover:text-luckoptics-gold transition-colors">Return & Replace</Link>
            </li>
            <li>
              <Link href="/support#payments" className="hover:text-luckoptics-gold transition-colors">Payments & Orders</Link>
            </li>
            <li>
              <Link href="/support#tracking" className="hover:text-luckoptics-gold transition-colors font-semibold text-luckoptics-gold/90">Order Tracking</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 border-b border-white/10 pb-2">Our Store</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2.5">
              <MapPin size={18} className="text-luckoptics-gold flex-shrink-0 mt-0.5" />
              <span>Lucknow Store, Near Hazratganj Crossing, Lucknow, UP - 226001</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-luckoptics-gold flex-shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-luckoptics-gold flex-shrink-0" />
              <span>support@luckoptical.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-luckoptics-primary/20 bg-black/20 py-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} LuckOptics Store. All Rights Reserved. 2026</p>
          {/* <p>Designed with ❤️ by <Link href="https://www.instagram.com/princemishra.09">Prince Mishra</Link></p> */}
        </div>
      </div>
    </footer>
  );
}
