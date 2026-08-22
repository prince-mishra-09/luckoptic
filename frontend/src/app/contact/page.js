'use client';
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate contact form submission
    console.log('Contact inquiry submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <section className="text-center max-w-xl mx-auto space-y-3">
        <h2 className="font-display font-black text-3xl text-luckoptics-dark">Get in Touch with Us</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Have questions about your prescription power, frame fitting, or order status? Send us a message or visit our Lucknow store.
        </p>
      </section>

      {/* Grid: Details & Form */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-luckoptics-dark mb-4">Contact Details</h3>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl mt-0.5">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Our Retail Shop Address</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  LuckOptics Store, Hazratganj Crossing, Near Royal Cafe, Lucknow, Uttar Pradesh - 226001
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl mt-0.5">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Phone Enquiries</h4>
                <p className="text-xs text-gray-500 mt-0.5">+91 98765 43210 (Mon-Sat, 10 AM to 8 PM)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl mt-0.5">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Email Address</h4>
                <p className="text-xs text-gray-500 mt-0.5">support@luckoptical.in</p>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Helper Card */}
          <div className="bg-green-50 border border-green-200/50 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-green-500 text-white rounded-xl">
              <MessageSquare size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-green-800">WhatsApp Instant Inquiry</h4>
              <p className="text-xs text-green-700/80 leading-relaxed">
                Connect instantly with our shop assistants to verify frame stock or upload your prescription scan.
              </p>
              <a
                href="https://wa.me/919876543210?text=Hi%20Luck%20Optical%2C%20I%20have%20an%20enquiry%20regarding%20eyeglasses."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-green-600 px-4 py-2 rounded-lg mt-3 shadow-md hover:bg-green-700 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="font-display font-bold text-lg text-luckoptics-dark mb-6">Send an Inquiry</h3>

          {submitted ? (
            <div className="p-6 bg-luckoptics-primary/10 border border-luckoptics-primary/20 rounded-xl text-center space-y-2">
              <h4 className="font-bold text-luckoptics-dark">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-gray-600">
                Thank you for contacting LuckOptics. Our representative will call or email you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-luckoptics-primary underline hover:text-luckoptics-dark transition-colors mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Message / Request</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your inquiry (e.g. prescription help, frame availability, custom request)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-luckoptics-primary text-white font-bold text-sm py-3.5 rounded-xl hover:bg-luckoptics-primary/95 transition-all shadow-md cursor-pointer"
              >
                <Send size={16} />
                Submit Enquiry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Google Map Embed Placeholder */}
      <section className="bg-gray-100 h-80 rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
        <div className="text-center space-y-2 relative z-10 p-4">
          <MapPin size={32} className="text-red-500 mx-auto" />
          <h4 className="font-display font-bold text-gray-800 text-sm">Find LuckOptics Hazratganj Store</h4>
          <p className="text-xs text-gray-500 max-w-sm">Hazratganj Crossing, Near Royal Cafe, Lucknow, UP - 226001</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-bold text-luckoptics-primary underline hover:text-luckoptics-dark pt-1"
          >
            Open in Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
