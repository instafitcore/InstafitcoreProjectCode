"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { LucideIcon } from "lucide-react";

import Image from "next/image";
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ImageIcon,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Review {
  id: number;
  rating: number;
  employee_name: string | null;
  service_details: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  images: string[];
  service_name: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_reviews")
        .select(`
          id,
          rating,
          employee_name,
          service_details,
          status,
          created_at,
          images,
          services!left ( service_name )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to load reviews");
      } else {
        setReviews(
          data.map((r: any) => ({
            ...r,
            images: r.images ?? [],
            service_name: r.services?.service_name ?? "General Service",
          }))
        );
      }
      setLoading(false);
    };
    fetch();
  }, []);

  // ---------------- UPDATE ----------------
  const updateStatus = async (id: number, status: Review["status"]) => {
    const prev = [...reviews];
    setReviews((r) =>
      r.map((i) => (i.id === id ? { ...i, status } : i))
    );

    const { error } = await supabase
      .from("service_reviews")
      .update({ status, is_approved: status === "approved" })
      .eq("id", id);

    if (error) {
      alert("Update failed");
      setReviews(prev);
    }
  };

  const filtered = reviews.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  // ---------------- HELPERS ----------------
  const badge = (status: Review["status"]) => {
  const map: Record<
    Review["status"],
    [string, string, LucideIcon]
  > = {
    approved: ["Approved", "bg-green-100 text-green-700", CheckCircle],
    rejected: ["Rejected", "bg-red-100 text-red-700", XCircle],
    pending: ["Pending", "bg-yellow-100 text-yellow-700", Clock],
  };

  const [label, cls, Icon] = map[status];

  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
      <Icon size={14} />
      {label}
    </span>
  );
};


  const stars = (n: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={15}
          className={i < n ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">
              Reviews Moderation
            </h1>
            <p className="text-slate-500">
              Approve, reject and manage service feedback
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="outline-none font-bold bg-transparent"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* STATES */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex gap-2">
            <AlertCircle /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin w-12 h-12 text-[#8ed26b]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border p-20 text-center">
            <ImageIcon className="mx-auto text-slate-300" size={44} />
            <p className="mt-3 font-bold text-slate-500">No reviews found</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition p-6 flex flex-col"
              >
                {/* TOP */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{r.service_name}</h3>
                    <p className="text-xs text-[#8ed26b] font-bold">
                      Staff: {r.employee_name ?? "N/A"}
                    </p>
                  </div>
                  {badge(r.status)}
                </div>

                {stars(r.rating)}

                {/* MESSAGE */}
                <p className="mt-4 italic text-slate-600 flex-1">
                  {r.service_details ?? "No written review provided."}
                </p>

                {/* IMAGES */}
                {r.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {r.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative h-24 rounded-xl overflow-hidden border"
                      >
                        <Image
                          src={img}
                          alt="Review"
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover hover:scale-105 transition"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* FOOTER */}
                <div className="mt-6 flex justify-between items-center text-xs text-slate-400">
                  <span>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => updateStatus(r.id, "approved")}
                    className="flex-1 bg-[#8ed26b] hover:bg-[#7ac65d] text-white py-2 rounded-xl font-bold transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "rejected")}
                    className="flex-1 border border-rose-200 text-rose-600 py-2 rounded-xl font-bold hover:bg-rose-50 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
