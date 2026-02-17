"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, Star, LucideIcon, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

// --- ContactInfoCard Props ---
type ContactInfoCardProps = {
  icon: LucideIcon;
  title: string;
  content: string | React.ReactNode;
  link?: string;
};

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon: Icon, title, content, link }) => (
  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex-shrink-0 p-3 rounded-xl bg-instafitcore-green/10 text-instafitcore-green">
      <Icon className="w-5 h-5 sm:w-6 h-6" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{title}</h3>
      <div className="text-sm sm:text-base text-gray-600 mt-1 break-words">
        {link ? (
          <a href={link} className="text-instafitcore-green font-medium hover:underline block truncate sm:whitespace-normal">
            {content}
          </a>
        ) : (
          <div className="leading-relaxed">{content}</div>
        )}
      </div>
    </div>
  </div>
);

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialMessage, setTestimonialMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/send-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setName(""); setEmail(""); setMessage("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally { setLoading(false); }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { alert("Please select a rating"); return; }
    const { error } = await supabase.from("testimonials").insert([{ name: testimonialName, message: testimonialMessage, rating }]);
    if (error) { alert("Failed to submit review."); return; }
    setTestSuccess(true);
    setTestimonialName(""); setTestimonialMessage(""); setRating(0);
    setTimeout(() => setTestSuccess(false), 4500);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* HERO - Reduced height on mobile for better visibility */}
      <section className="relative py-12 sm:py-20 bg-instafitcore-green flex items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <p className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
            Ready to Connect?
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Let's Talk
          </h1>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* CONTACT INFO - Comes first on mobile */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-instafitcore-green mb-3">Contact Details</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Need immediate assistance? Reach us through any of the channels below.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <ContactInfoCard icon={Phone} title="Customer Support" content="customersupport@instafitcore.com" link="mailto:customersupport@instafitcore.com" />
              <ContactInfoCard icon={Mail} title="Grievance" content="Feedback@instafitcore.com" link="mailto:Feedback@instafitcore.com" />
              <ContactInfoCard icon={MapPin} title="Head Office" content={<>G7 Kemps Green View, Ayyappanagar, KR Puram, Bangalore</>} />
            </div>
          </div>

          {/* ENQUIRY FORM */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send an Enquiry</h2>
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-200">
                🥳 Your message has been sent successfully!
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text" placeholder="Full Name" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-instafitcore-green outline-none transition-all"
                />
                <input
                  type="email" placeholder="Email Address" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-instafitcore-green outline-none transition-all"
                />
              </div>
              <textarea
                rows={5} placeholder="How can we help you?" required value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-instafitcore-green outline-none transition-all"
              />
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-instafitcore-green text-white font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : <><Send className="w-5 h-5" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>

        {/* MAP - Ensure it doesn't overflow */}
        <div className="max-w-7xl mx-auto mt-12 sm:mt-20 px-5 sm:px-8">
          <h3 className="text-xl font-bold text-gray-900 mb-5">Our Location</h3>
          <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-inner border border-gray-200 bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.653457563507!2d77.6974136!3d13.0113171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzQwLjciTiA3N8KwNDEnNTAuNyJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin"
              className="w-full h-full grayscale contrast-125"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* TESTIMONIAL FORM - Optimized for mobile tapping */}
        <div className="max-w-3xl mx-auto mt-12 sm:mt-20 px-5">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-2 text-gray-900 text-center">Share Your Experience</h3>
            <p className="text-gray-500 text-center mb-8 text-sm">Your feedback helps us grow.</p>
            
            {testSuccess && (
              <div className="p-4 mb-6 bg-green-50 text-green-700 text-sm text-center font-medium rounded-xl border border-green-200">
                Thank you for your valuable feedback!
              </div>
            )}
            
            <form onSubmit={handleTestimonialSubmit} className="space-y-5">
              <input
                type="text" placeholder="Your Name" required value={testimonialName}
                onChange={(e) => setTestimonialName(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-instafitcore-green"
              />
              
              <div className="flex flex-col items-center gap-3 py-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Rate your experience</span>
                <div className="flex space-x-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star} type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transform active:scale-125 transition-transform"
                    >
                      <Star
                        size={32}
                        className={`${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                        fill={rating >= star ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={4} placeholder="What did you like about our service?" required value={testimonialMessage}
                onChange={(e) => setTestimonialMessage(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-instafitcore-green"
              />
              
              <button
                type="submit"
                className="w-full py-4 rounded-xl text-white font-bold bg-instafitcore-green hover:opacity-90 transition-all"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA - Fixed button sizing for mobile */}
      <section className="py-14 sm:py-20 bg-instafitcore-green text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Need Services Right Away?
          </h2>
          <p className="text-white/80 text-sm sm:text-lg mb-8">
            Skip the message and head straight to booking.
          </p>
          <Link
            href="/site/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-instafitcore-green font-bold rounded-full hover:bg-gray-50 transition-colors shadow-lg"
          >
            Book a Service Now <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}