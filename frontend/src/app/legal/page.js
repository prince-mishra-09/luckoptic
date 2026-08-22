'use client';
import React, { useState, useEffect } from 'react';
import { 
  Shield, FileText, AlertTriangle, RotateCcw, 
  ChevronRight, ArrowRight, ShieldCheck, Scale
} from 'lucide-react';

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState('privacy');

  // Handle smooth scroll on hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const headerOffset = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Set active section based on hash
          const sectionName = hash.replace('#', '');
          setActiveSection(sectionName);
        }
      }
    };

    // Run on initial mount
    setTimeout(handleHashChange, 100);

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const menuItems = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
    { id: 'refunds', label: 'Refund Policy', icon: RotateCcw }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-luckoptics-dark text-white rounded-3xl p-8 sm:p-12 mb-10 relative overflow-hidden shadow-xl border border-white/5">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none hidden md:block">
          <Scale size={280} className="text-luckoptics-primary translate-x-12 translate-y-12" />
        </div>
        <div className="max-w-xl space-y-3 relative z-10">
          <span className="text-[10px] font-bold text-luckoptics-primary uppercase tracking-widest bg-luckoptics-primary/10 px-3 py-1 rounded-full border border-luckoptics-primary/20">
            LuckOptics Compliance Desk
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight">Legal Center & Policies</h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
            Please read our customer agreements, optical disclaimers, privacy policies, and refund rules below to ensure a safe and protected transaction environment.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sticky Left Sidebar Navigation */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-24 flex-shrink-0 z-20">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-1.5">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Legal Navigation</h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive 
                      ? 'bg-luckoptics-primary/10 border-luckoptics-primary/20 text-luckoptics-primary' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-luckoptics-dark'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </aside>

        {/* Support Sections Content */}
        <div className="flex-grow space-y-12 w-full">
          
          {/* Privacy Policy */}
          <section id="privacy" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <Shield size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Privacy Policy</h2>
            </div>
            
            <div className="space-y-4 text-xs text-gray-500 font-medium leading-relaxed max-w-4xl">
              <p>
                **Last Updated: August 21, 2026**
              </p>
              <p>
                At **LuckOptics**, we respect your personal data privacy and parameters. This Privacy Policy outlines how your information is stored, processed, and secured:
              </p>
              <h4 className="font-display font-bold text-gray-800 text-sm mt-4 mb-2">1. Information We Collect</h4>
              <p>
                We collect your name, shipping address, email ID, phone number, and customized optical prescription data parameters (Sphere, Cylinder, Axis, Add, Pupil Distance) that you submit during order checkout.
              </p>
              <h4 className="font-display font-bold text-gray-800 text-sm mt-4 mb-2">2. How We Use Data</h4>
              <p>
                Your data is exclusively used to process orders, verify prescription alignments, customize lenses in our laboratory, print shipping labels, and communicate delivery timelines or support ticket statuses. We **do not sell or share** your clinical parameters with any third-party marketing companies.
              </p>
              <h4 className="font-display font-bold text-gray-800 text-sm mt-4 mb-2">3. Transaction Safety & Encryption</h4>
              <p>
                All account logins and online checkout transactions are processed over encrypted Secure Sockets Layer (SSL) channels. Payment credentials are handled through PCI-DSS compliant partner payment gateways.
              </p>
            </div>
          </section>

          {/* Terms & Conditions */}
          <section id="terms" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <FileText size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Terms & Conditions</h2>
            </div>
            
            <div className="space-y-4 text-xs text-gray-500 font-medium leading-relaxed max-w-4xl">
              <p>
                **Last Updated: August 21, 2026**
              </p>
              <p>
                Welcome to the website of **LuckOptics** (luckoptics.in). By accessing this site and placing retail orders, you agree to comply with the following Terms and Conditions of Service:
              </p>
              <h4 className="font-display font-bold text-gray-800 text-sm mt-4 mb-2">1. User Account Responsibility</h4>
              <p>
                You represent that all information provided during registration or checkout (especially shipping details and contact credentials) is accurate. You are responsible for keeping your login credentials confidential.
              </p>
              <h4 className="font-display font-bold text-gray-800 text-sm mt-4 mb-2">2. Prescription Verification Representation</h4>
              <p>
                When ordering customized power prescription lenses, you represent and warrant that the prescription details submitted correspond to a valid, active script prescribed to you by a qualified optician or ophthalmologist within the last 12 months.
              </p>
              <h4 className="font-display font-bold text-gray-800 text-sm mt-4 mb-2">3. Order Acceptance & Price Adjustments</h4>
              <p>
                LuckOptics reserves the right to decline or cancel custom orders if laboratory audits indicate extreme prescription limits that cannot be safely mounted to the selected frame type (e.g. mounting thick high-minus power lenses to rimless frames).
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section id="disclaimer" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <AlertTriangle size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Legal Disclaimer</h2>
            </div>
            
            <div className="space-y-4 text-xs text-gray-500 font-medium leading-relaxed max-w-4xl">
              <h4 className="font-display font-bold text-gray-800 text-sm mt-2 mb-2">1. General Information Purpose</h4>
              <p>
                The information provided on this platform regarding frame dimensions, lens types (e.g. blue blockers, photochromic, anti-glare), and eye checkup processes is for general educational purposes only and should not replace professional clinical consulting.
              </p>
              <h4 className="font-display font-bold text-gray-800 text-sm mt-4 mb-2">2. Adaptation Tolerances & Liability</h4>
              <p>
                New prescription glasses, especially progressive or high-astigmatism lenses, require a natural adaptation period of 3-7 days. LuckOptics is not liable for adaptational headaches or minor visual imbalances if the user manually inputs incorrect parameters that do not match their certified medical card.
              </p>
              <h4 className="font-display font-bold text-gray-800 text-sm mt-4 mb-2">3. Trademark Disclaimers</h4>
              <p>
                All designer frame brand names (e.g., Ray-Ban, Vogue, Oakley) displayed on the website are trademarks of their respective owners. We are authorized retail suppliers, and all products are guaranteed 100% authentic.
              </p>
            </div>
          </section>

          {/* Refund Policy */}
          <section id="refunds" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <RotateCcw size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Refund & Return Policy</h2>
            </div>
            
            <div className="space-y-4 text-xs text-gray-500 font-medium leading-relaxed max-w-4xl">
              <p>
                At **LuckOptics**, we want to ensure you are fully satisfied with your eyewear frame fit. If something is not right, here is how we process returns and billing refunds:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>**14-Day Returns:** Frames and sunglasses in completely unused condition with tags and security seals intact can be returned or exchanged within 14 days of order receipt.</li>
                <li>**Custom-Fitted Lenses Exception:** Lenses are custom-cut for each order according to specific ocular parameters. The cost of custom lenses is non-refundable. If there is a processing or laboratory alignment error, we will replace the lenses free of charge.</li>
                <li>**COD Order Refunds:** If you paid via Cash on Delivery (COD), your refund will be processed via direct Bank Transfer or UPI once our support desk verifies your details.</li>
              </ul>
              <div className="bg-amber-50/40 p-4 border border-amber-100/50 rounded-2xl text-amber-900 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  **Inspection Period:** Returns undergo rigorous laboratory quality checks upon receipt at our Lucknow hub. Any damaged or modified products will not be eligible for refund processing.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
