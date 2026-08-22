'use client';
import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Headphones, Truck, RefreshCw, CreditCard, 
  Search, Check, CheckCircle, Clock, ArrowRight, ShieldCheck, 
  User, Mail, FileText, ChevronDown, ChevronUp, MapPin
} from 'lucide-react';

const faqItems = [
  {
    q: "How do I provide my lens prescription?",
    a: "After selecting your frame, you can upload a photo of your prescription directly during the add-to-cart process or input the values manually. Alternatively, you can email it to support@luckoptical.in or WhatsApp us on +91 98765 43210 with your Order ID."
  },
  {
    q: "Do you offer Cash on Delivery (COD)?",
    a: "Yes! We offer free Cash on Delivery (COD) for orders up to ₹5,000 across Lucknow and most major pin codes in India."
  },
  {
    q: "What is your return and exchange policy?",
    a: "We offer a 14-day hassle-free exchange or return policy for all frames and sunglasses. Please note that custom-made prescription lenses cannot be refunded as they are tailored specifically to your eyes, but we will happily replace them if they do not match your prescription values."
  },
  {
    q: "How long does delivery take?",
    a: "For Lucknow residents, we offer fast 24-48 hours delivery. For other states, it usually takes 3-5 business days. Frames requiring custom prescription power fitting may take an extra 24 hours to craft in our lab."
  },
  {
    q: "Can I try frames at home before buying?",
    a: "Yes, we offer a 'Try @ Home' service in Lucknow. You can select up to 5 frames, and our certified optician will visit your home for a trial and free eye checkup. Visit our 'Try @ Home' page in the navbar to book."
  }
];

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('faq');
  
  // Support Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', orderId: '', category: 'General Inquiry', message: '' });
  
  // Tracking Widget State
  const [trackId, setTrackId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [trackingError, setTrackingError] = useState('');

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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setTicketId(Math.floor(100000 + Math.random() * 900000));
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', orderId: '', category: 'General Inquiry', message: '' });
    }, 1000);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setTrackingError('');
    setTrackingData(null);

    if (!trackId.trim()) {
      setTrackingError('Please enter a valid Order ID');
      return;
    }

    // Mock tracking query execution
    const mockId = trackId.toUpperCase().trim();
    setTrackingData({
      orderId: mockId,
      status: 'In Transit',
      estimatedDelivery: 'Tomorrow, by 6:00 PM',
      steps: [
        { title: 'Order Placed & Verified', date: 'Aug 20, 2026 - 10:30 AM', desc: 'Payment received & prescription parameters verified.', status: 'completed' },
        { title: 'Lenses Custom Crafting', date: 'Aug 20, 2026 - 4:15 PM', desc: 'Precision lens parameters cut and fitted in our Lucknow laboratory.', status: 'completed' },
        { title: 'Quality Assurance Check', date: 'Aug 21, 2026 - 9:00 AM', desc: 'UV alignment check, scratch index audit & anti-glare testing passed.', status: 'completed' },
        { title: 'Dispatched via Courier', date: 'Aug 21, 2026 - 2:00 PM', desc: 'Handed over to LuckOptics Express Delivery team. Tracking ID: LOP-9902.', status: 'active' },
        { title: 'Delivered', date: 'Aug 22, 2026 (Est.)', desc: 'OTP verification will be required at delivery.', status: 'pending' }
      ]
    });
  };

  const menuItems = [
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
    { id: 'customer-services', label: 'Customer Services', icon: Headphones },
    { id: 'shipping-delivery', label: 'Shipping & Delivery', icon: Truck },
    { id: 'returns-replacements', label: 'Return & Replace', icon: RefreshCw },
    { id: 'payments', label: 'Payments & Billings', icon: CreditCard },
    { id: 'tracking', label: 'Order Tracking', icon: MapPin }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-luckoptics-dark text-white rounded-3xl p-8 sm:p-12 mb-10 relative overflow-hidden shadow-xl border border-white/5">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none hidden md:block">
          <Headphones size={280} className="text-luckoptics-primary translate-x-12 translate-y-12" />
        </div>
        <div className="max-w-xl space-y-3 relative z-10">
          <span className="text-[10px] font-bold text-luckoptics-primary uppercase tracking-widest bg-luckoptics-primary/10 px-3 py-1 rounded-full border border-luckoptics-primary/20">
            LuckOptics Support Desk
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight">Help & Support Center</h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
            Need help with your prescription? Want to track an active shipment? Explore our FAQs, submit a support ticket, or track your orders in real-time.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sticky Left Sidebar Navigation */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-24 flex-shrink-0 z-20">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-1.5">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Help Navigation</h3>
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
          
          {/* FAQ Section */}
          <section id="faq" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <HelpCircle size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-3.5">
              {faqItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left p-4.5 font-display font-bold text-sm text-luckoptics-dark hover:bg-gray-50/50 transition-colors"
                  >
                    <span>{item.q}</span>
                    {activeFaq === idx ? <ChevronUp size={16} className="text-luckoptics-primary" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  {activeFaq === idx && (
                    <div className="px-4.5 pb-4.5 pt-1 border-t border-gray-50 text-xs text-gray-500 leading-relaxed font-medium bg-gray-50/20">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Customer Services Support Form */}
          <section id="customer-services" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <Headphones size={22} />
              </div>
              <div>
                <h2 className="font-display font-black text-xl text-luckoptics-dark">Customer Service Desk</h2>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Average Response Time: 2-4 Hours</p>
              </div>
            </div>

            {formSubmitted ? (
              <div className="text-center py-10 px-4 space-y-4 max-w-sm mx-auto">
                <div className="inline-flex p-4 bg-green-50 text-green-500 rounded-full">
                  <CheckCircle size={44} />
                </div>
                <h3 className="font-display font-bold text-gray-800 text-lg">Query Submitted!</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Thank you for reaching out. We have logged your request under ticket ID **#LOQ-{ticketId}**. Our optician support desk will contact you via email shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2 bg-luckoptics-dark text-white font-bold text-xs rounded-xl shadow hover:bg-luckoptics-primary transition-colors cursor-pointer"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Your Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={15} /></span>
                      <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="John Doe" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all font-medium text-gray-800"
                        value={formData.name}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={15} /></span>
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="name@example.com" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all font-medium text-gray-800"
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Order ID (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FileText size={15} /></span>
                      <input 
                        type="text" 
                        name="orderId"
                        placeholder="e.g. LO-10294" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all font-medium text-gray-800 uppercase"
                        value={formData.orderId}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Query Category</label>
                    <select 
                      name="category"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all font-medium text-gray-800"
                      value={formData.category}
                      onChange={handleFormChange}
                    >
                      <option>General Inquiry</option>
                      <option>Prescription Power Query</option>
                      <option>Shipping & Delivery Lag</option>
                      <option>Returns & Exchanges Request</option>
                      <option>Payment & Refund Query</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Describe Your Issue</label>
                  <textarea 
                    name="message"
                    required
                    rows={4}
                    placeholder="Provide details about your frame parameters, query or help request..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all font-medium text-gray-800"
                    value={formData.message}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-luckoptics-primary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-luckoptics-primary/95 transition-all cursor-pointer uppercase tracking-wider"
                >
                  <span>Submit Ticket</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </section>

          {/* Shipping & Delivery */}
          <section id="shipping-delivery" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <Truck size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Shipping & Delivery Policies</h2>
            </div>
            
            <div className="space-y-4 text-xs text-gray-500 font-medium leading-relaxed max-w-4xl">
              <p>
                We at **LuckOptics** are committed to delivering your premium eyewear safely, securely, and as fast as possible. Below are the details of our delivery timelines:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                <div className="bg-gray-50/50 p-4 border border-gray-100 rounded-2xl">
                  <span className="font-display font-black text-luckoptics-primary text-sm block mb-1">Lucknow Express</span>
                  <p className="text-[11px]">Free delivery within 24-48 hours across Lucknow city limits. Standard cod/prepaid available.</p>
                </div>
                <div className="bg-gray-50/50 p-4 border border-gray-100 rounded-2xl">
                  <span className="font-display font-black text-luckoptics-primary text-sm block mb-1">National Metros</span>
                  <p className="text-[11px]">Deliveries to Delhi-NCR, Mumbai, Bangalore, Pune, etc., take 3-4 business days.</p>
                </div>
                <div className="bg-gray-50/50 p-4 border border-gray-100 rounded-2xl">
                  <span className="font-display font-black text-luckoptics-primary text-sm block mb-1">Other Locations</span>
                  <p className="text-[11px]">Other cities and remote pin codes take 4-6 business days via partner logistics.</p>
                </div>
              </div>
              <div className="bg-blue-50/40 p-4 border border-blue-100/50 rounded-2xl text-blue-900 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  **Laboratory Lens Fitting:** Frames requiring custom single-vision or bifocal lens installation undergo precision lab fitting. This takes an additional 24 hours of curing and quality checking before package dispatch.
                </p>
              </div>
            </div>
          </section>

          {/* Return & Replace */}
          <section id="returns-replacements" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <RefreshCw size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Return & Replacement Policies</h2>
            </div>
            
            <div className="space-y-4 text-xs text-gray-500 font-medium leading-relaxed max-w-4xl">
              <p>
                We stand behind the quality of our frames and optical alignment. If you are not satisfied with your purchase, we provide easy return parameters:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>**14-Day Return Window:** You can request a return or size exchange within 14 days of order delivery.</li>
                <li>**Prescription Lenses Policy:** Since lenses are custom-crafted specifically to your power parameter indices, the lens pricing component is non-refundable. However, if there is a laboratory prescription matching issue, we will replace the lenses free of cost.</li>
                <li>**Pickup Process:** We arrange a free pick-up from your home within Lucknow. For other locations, partner courier pickups will be organized.</li>
                <li>**Condition:** The products must be completely unused, with the tags and original protective boxes intact.</li>
              </ul>
            </div>
          </section>

          {/* Payments & Billings */}
          <section id="payments" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <CreditCard size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Payments, Billings & Refund Timelines</h2>
            </div>
            
            <div className="space-y-4 text-xs text-gray-500 font-medium leading-relaxed max-w-4xl">
              <p>
                LuckOptics ensures secure checkout options. We accept the following modes of billing payment:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center text-[10px] font-bold text-gray-700">UPI (GPay / PhonePe)</div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center text-[10px] font-bold text-gray-700">Debit / Credit Cards</div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center text-[10px] font-bold text-gray-700">Net Banking</div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center text-[10px] font-bold text-gray-700">Cash on Delivery (COD)</div>
              </div>
              <p>
                **Refund Processing Times:** Once a returned order arrives back at our Lucknow warehouse and passes quality checks, refunds are initiated immediately. Debit card/UPI refunds take **24-48 hours**, while Credit card reversals may take **3-5 business days** depending on banking channels.
              </p>
            </div>
          </section>

          {/* Real-time Order Tracking Console */}
          <section id="tracking" className="scroll-mt-24 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
              <div className="p-2 bg-luckoptics-primary/10 text-luckoptics-primary rounded-xl">
                <MapPin size={22} />
              </div>
              <h2 className="font-display font-black text-xl text-luckoptics-dark">Order Tracking Console</h2>
            </div>
            
            <div className="space-y-5">
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Enter your Order Identification Number below to view the active transit parameters and laboratory progress timeline.
              </p>

              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="relative flex-grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={15} /></span>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter Order ID (e.g. LO-10294)" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-hidden focus:border-luckoptics-primary focus:bg-white transition-all font-semibold uppercase text-gray-800"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-luckoptics-dark hover:bg-luckoptics-primary text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider"
                >
                  Track Order
                </button>
              </form>

              {trackingError && (
                <p className="text-xs text-red-600 font-semibold">{trackingError}</p>
              )}

              {/* Dynamic Tracking Status Timeline */}
              {trackingData && (
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 sm:p-6 mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 mb-5 gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order ID</span>
                      <h4 className="font-display font-black text-sm text-luckoptics-dark">{trackingData.orderId}</h4>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest sm:text-right block">Estimated Delivery</span>
                      <span className="font-display font-bold text-xs text-luckoptics-primary block">{trackingData.estimatedDelivery}</span>
                    </div>
                  </div>

                  {/* Vertical Progress Steps */}
                  <div className="relative pl-6 border-l border-gray-200 ml-3 space-y-6 py-2">
                    {trackingData.steps.map((step, idx) => {
                      const isCompleted = step.status === 'completed';
                      const isActive = step.status === 'active';
                      return (
                        <div key={idx} className="relative">
                          {/* Dot indicator */}
                          <div className={`absolute -left-[30px] top-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white shadow-xs' 
                              : isActive 
                                ? 'bg-luckoptics-primary border-luckoptics-primary text-white animate-pulse' 
                                : 'bg-white border-gray-200 text-gray-300'
                          }`}>
                            {isCompleted ? <Check size={10} /> : <Clock size={10} />}
                          </div>

                          {/* Content */}
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className={`font-display font-bold text-xs ${isActive ? 'text-luckoptics-primary font-black' : 'text-gray-800'}`}>
                                {step.title}
                              </h5>
                              <span className="text-[9px] text-gray-400 font-bold">{step.date}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
