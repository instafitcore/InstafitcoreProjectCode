"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { CheckCircle, Users, ArrowRight, Target, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setTestimonials(data);
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-4xl px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Our Commitment to Excellence
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mt-4 font-medium">
            Discover the heart of <span className="font-bold text-instafitcore-green">InstaFitCore Solutions</span> and our promise to you.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-20">

        {/* Who We Are */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-2 ring-4 ring-indigo-100 mx-auto">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Who We Are
          </h2>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            At <span className="font-semibold text-instafitcore-green">InstaFitCore Solutions Pvt. Ltd.</span>,  we deliver end-to-end furniture and home service solutions for residential and commercial spaces. From last-mile delivery to professional installation and completion, our certified professionals ensure every project is executed with precision, safety, and accountability. We specialize in customized modular furniture, modular kitchen solutions, packers & movers, and B2B services operations, all powered by a technology-driven platform. Our commitment is to provide consistent quality, timely execution, and a seamless customer experience across every engagement.</p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg sm:text-xl">
             At <span className="font-semibold text-instafitcore-green">InstaFitCore Solutions Pvt. Ltd.,</span> we simplify furniture and home services through <strong>trust, technology, and transparency</strong>,  delivering reliable outcomes and complete peace of mind. By combining skilled workmanship with structured processes, we elevate service standards across the industry and ensure every customer experience is seamless and dependable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {[
              { title: "Professional & Punctual Service", desc: "Services delivered by trained and certified professionals with a strong focus on quality, safety, and on-time completion." },
              { title: "End-to-End Execution", desc: "From delivery, installation, and setup to modular kitchens, relocation services, and post-service support, we manage the entire service lifecycle." },
              { title: "Fair & Transparent Pricing", desc: "Clear and upfront pricing with no hidden charges, ensuring full clarity before service confirmation." },
              { title: "Empowering Skilled Technicians", desc: "We invest in training, compliance, and long-term growth opportunities to build a reliable and professional service ecosystem" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="flex items-start space-x-3 p-4 border border-gray-100 rounded-2xl bg-gray-50 shadow-sm"
              >
                <CheckCircle className="w-6 h-6 text-instafitcore-green mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 text-base">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10">What Our Customers Say</h2>
          {loading && <p className="text-center text-gray-500 py-6">Loading testimonials...</p>}
          {!loading && testimonials.length === 0 && <p className="text-center text-gray-500 py-6">No testimonials yet.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl shadow-md"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-instafitcore-green" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">“{item.message}”</p>
                <p className="mt-3 font-semibold text-gray-900 text-sm sm:text-base">— {item.name}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-3xl p-8 sm:p-12 shadow-inner border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-4 ring-4 ring-indigo-100 mx-auto">
            <Target className="w-8 h-8 text-instafitcore-green-hover" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            To become India’s most trusted platform for furniture assembly and home services, connecting customers, retailers, and professionals through technology and transparency.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/site/services"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-instafitcore-green to-instafitcore-green-hover text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Explore Services
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>

          <a
            href="/site/contact"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-instafitcore-green text-instafitcore-green font-semibold rounded-full shadow-md hover:bg-instafitcore-green hover:text-white hover:scale-105 transition-transform duration-300"
          >
            Get a Free Quote
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>

      </div>
    </div>
  );
}
