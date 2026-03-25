"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import {
  Search,
  FileText,
  Trash2,
  Mail,
  User,
  Calendar,
  Download,
  X,
} from "lucide-react";
import { useAdminToast } from "@/components/AdminToast";

type CareerApplication = {
  id: number;
  name: string;
  email: string;
  message: string | null;
  resume_url: string;
  created_at: string;
};

export default function AdminCareersPage() {
  const { addToast } = useAdminToast();

  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CareerApplication | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ================= FETCH ================= */
  const fetchApplications = async (q = "") => {
    setLoading(true);
    try {
      let query = supabase
        .from("career_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (q.trim()) {
        query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setApplications(data || []);
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    setDeleteId(id);
    const { error } = await supabase
      .from("career_applications")
      .delete()
      .eq("id", id);

    if (error) {
      addToast(error.message, "error");
    } else {
      addToast("Application deleted", "success");
      fetchApplications(search);
    }
    setDeleteId(null);
  };

  /* ================= EXPORT ================= */
  const exportToExcel = () => {
    if (!applications.length) {
      addToast("No data to export", "error");
      return;
    }

    const headers = ["ID", "Name", "Email", "Message", "Resume", "Created At"];
    const rows = applications.map((a) => [
      a.id,
      a.name,
      a.email,
      a.message ?? "",
      a.resume_url,
      new Date(a.created_at).toLocaleString(),
    ]);

    const csv =
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `career_applications_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">
              Career Applications
            </h1>
            <p className="text-slate-500 mt-1">
              Manage and review job applications
            </p>
          </div>

          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 bg-[#8ed26b] text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:bg-[#76c65a]"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  fetchApplications(e.target.value);
                }}
                placeholder="Search by name or email"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8ed26b]"
              />
            </div>

            <button
              onClick={() => {
                setSearch("");
                fetchApplications("");
              }}
              disabled={!search}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          <div className="text-right text-sm text-slate-500 mt-2">
            Total applications:{" "}
            <span className="font-bold">{applications.length}</span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 bg-white rounded-2xl border animate-pulse"
                />
              ))
            : applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-500" />
                        <h3 className="font-bold text-lg">{app.name}</h3>
                      </div>
                      <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                        <Mail size={14} /> {app.email}
                      </p>
                    </div>
                  </div>

                  <p className="flex items-center gap-1 text-xs text-slate-400 mb-4">
                    <Calendar size={14} />
                    {new Date(app.created_at).toLocaleString()}
                  </p>

                  {app.message && (
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl line-clamp-3 mb-4">
                      {app.message}
                    </p>
                  )}

                  <div className="mt-auto flex gap-2">
                    <a
                      href={app.resume_url}
                      target="_blank"
                      className="flex-1 bg-[#8ed26b]/15 text-[#6cb84e] py-2 rounded-xl font-semibold flex items-center justify-center gap-1 hover:bg-[#8ed26b]/25"
                    >
                      <FileText size={16} /> Resume
                    </a>

                    <button
                      onClick={() => setSelected(app)}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-100"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(app.id)}
                      disabled={deleteId === app.id}
                      className="bg-rose-50 text-rose-600 px-3 rounded-xl hover:bg-rose-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* MODAL */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
              >
                <X />
              </button>

              <h2 className="text-2xl font-bold mb-4">
                Application Details.
              </h2>

              <p>
                <strong>Name:</strong> {selected.name}
              </p>
              <p className="mb-3">
                <strong>Email:</strong> {selected.email}
              </p>

              {selected.message && (
                <div className="bg-slate-50 p-4 rounded-xl mb-4">
                  {selected.message}
                </div>
              )}

              <a
                href={selected.resume_url}
                target="_blank"
                className="inline-flex items-center gap-2 bg-[#8ed26b] text-white px-4 py-2 rounded-xl font-semibold"
              >
                <FileText size={18} /> Open Resume
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
