"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Users, Rocket, Send, Mail, Upload, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/Toast";

const ACCENT_COLOR = "text-[#8ed26b]";
const BG_ACCENT = "bg-[#8ed26b]";
const HOVER_ACCENT = "hover:bg-[#76c55d]";
const LIGHT_BG = "bg-[#f2faee]";

export default function CareersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast({ title: "Resume missing", description: "Please upload a PDF.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const fileName = `${Date.now()}_${resumeFile.name.replace(/\s/g, '_')}`;
      await supabase.storage.from("resumes").upload(fileName, resumeFile);
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
      await supabase.from("career_applications").insert([{ name, email, message, resume_url: urlData.publicUrl }]);
      
      setName(""); setEmail(""); setMessage(""); setResumeFile(null);
      toast({ title: "Submitted! 🚀", description: "We'll be in touch.", variant: "default" });
    } catch (err) {
      toast({ title: "Failed", description: "Try again later.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const benefits = [
    { icon: Rocket, title: "Fast Growth", desc: "Rapidly growing platform with huge opportunities." },
    { icon: Users, title: "Best Culture", desc: "Collaborate with pros who value your growth." },
    { icon: Briefcase, title: "Ownership", desc: "Real impact to thousands of homes daily." }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Compact */}
      <section className={`relative py-12 md:py-16 ${BG_ACCENT} overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-6">
          <span className="inline-block px-3 py-1 mb-3 text-[10px] font-black tracking-[0.2em] uppercase bg-white/20 text-white rounded-full">
            Join Our Team
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Career Opportunities
          </h1>
        </div>
      </section>

      {/* MAIN CONTENT AREA - TWO COLUMNS */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            
            {/* LEFT COLUMN: BENEFITS */}
            <div className="w-full lg:w-5/12 space-y-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Why InstaFitCore?</h2>
                <p className="text-gray-500 font-medium">We don't just offer jobs; we offer a platform to build the future of home services.</p>
              </div>

              <div className="space-y-6">
                {benefits.map(({ icon: Icon, title, desc }, idx) => (
                  <div key={idx} className="flex gap-5 group">
                    <div className={`flex-shrink-0 p-4 rounded-2xl ${LIGHT_BG} ${ACCENT_COLOR} transition-transform group-hover:scale-110 shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900 mb-1">{title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* EMAIL SUPPORT CARD */}
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Questions?</p>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#8ed26b]" />
                  <span className="text-sm font-bold text-gray-700">careers@instafitcore.com</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: APPLICATION FORM */}
            <div className="w-full lg:w-7/12">
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-8">Send Application</h3>

                <form onSubmit={handleApply} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Full Name</label>
                      <input
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#8ed26b] focus:bg-white outline-none transition-all placeholder:text-gray-300 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Email Address</label>
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#8ed26b] focus:bg-white outline-none transition-all placeholder:text-gray-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Why you?</label>
                    <textarea
                      rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="Briefly describe your experience..."
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#8ed26b] focus:bg-white outline-none transition-all placeholder:text-gray-300 text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1">Resume (PDF)</label>
                    <div className="relative group">
                      <input
                        type="file" id="resume-input" accept="application/pdf" required
                        onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`p-5 border-2 border-dashed rounded-2xl flex items-center gap-4 transition-all ${resumeFile ? 'border-[#8ed26b] bg-[#f2faee]' : 'border-gray-100 bg-gray-50 group-hover:border-[#8ed26b]/40'}`}>
                        {resumeFile ? (
                          <CheckCircle2 className="w-6 h-6 text-[#8ed26b]" />
                        ) : (
                          <Upload className="w-6 h-6 text-gray-300" />
                        )}
                        <span className="text-sm font-bold text-gray-500 truncate">
                          {resumeFile ? resumeFile.name : "Choose PDF file"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className={`w-full py-5 rounded-2xl text-white font-black text-sm tracking-widest shadow-xl shadow-[#8ed26b]/30 ${BG_ACCENT} ${HOVER_ACCENT} active:scale-[0.98] transition-all disabled:opacity-50 pt-6`}
                  >
                    {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}