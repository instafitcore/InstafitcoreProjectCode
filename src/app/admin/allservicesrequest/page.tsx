"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Loader2, X, Mail, Phone, User, Calendar,
    ChevronRight, ClipboardList, Building2,
    Truck, ChefHat, Armchair, Search, FileText, Download,
    ChevronDown, XCircle
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SERVICES = [
    {
        key: "customized_modular_furniture_requests",
        label: "Furniture",
        icon: <Armchair className="w-4 h-4" />,
        nameKey: "full_name",
        emailKey: "email",
        phoneKey: "mobile_number",
    },
    {
        key: "customized_modular_kitchen_requests",
        label: "Modular Kitchen",
        icon: <ChefHat className="w-4 h-4" />,
        nameKey: "full_name",
        emailKey: "email",
        phoneKey: "mobile_number",
    },
    {
        key: "packer_and_movers_requests",
        label: "Packers & Movers",
        icon: <Truck className="w-4 h-4" />,
        nameKey: "full_name",
        emailKey: "email",
        phoneKey: "mobile_number",
    },
    {
        key: "b2b_service_requirement_requests",
        label: "B2B Services",
        icon: <Building2 className="w-4 h-4" />,
        nameKey: "contact_person_name",
        emailKey: "official_email",
        phoneKey: "mobile_number",
    },
];

const STATUS_OPTIONS = ["New", "In Progress", "Contacted", "Closed"];

export default function AdminAllRequestsPage() {
    const [loading, setLoading] = useState(true);
    const [activeService, setActiveService] = useState(SERVICES[0]);
    const [rows, setRows] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchData(activeService.key);
    }, [activeService]);

    const fetchData = async (table: string) => {
        setLoading(true);
        const { data } = await supabase
            .from(table)
            .select("*")
            .order("created_at", { ascending: false });

        setRows(data || []);
        setLoading(false);
    };

    const filteredRows = rows.filter(row =>
        row[activeService.nameKey]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from(activeService.key)
            .update({ status })
            .eq("id", id);

        if (!error) {
            setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
        }
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case "In Progress": return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "Contacted": return "bg-blue-100 text-blue-700 border-blue-300";
            case "Closed": return "bg-green-100 text-green-700 border-green-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Service Requests Management.
                </h1>

                <div className="flex gap-3">
                    <button
                        onClick={() => {/* downloadExcel logic */}}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium shadow hover:bg-green-700 flex items-center gap-2"
                    >
                        <Download size={18} /> Excel
                    </button>
                    <button
                        onClick={() => {/* downloadPDF logic */}}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow hover:bg-red-700 flex items-center gap-2"
                    >
                        <FileText size={18} /> PDF
                    </button>
                </div>
            </div>

            {/* --- FILTER & TAB CARD --- */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Active Category: <span className="text-[#8ed26b]">{activeService.label}</span>
                    </h2>
                    <div className="px-4 py-1.5 bg-gray-50 rounded-full text-sm font-semibold text-[#8ed26b] border border-gray-100">
                        Total Requests: {loading ? "..." : rows.length}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Search */}
                    <div className="md:col-span-3 relative">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#8ed26b] focus:border-[#8ed26b] outline-none transition-all"
                        />
                    </div>
                    {/* Clear Button */}
                    <button
                        onClick={() => setSearchTerm("")}
                        className="w-full py-2.5 text-gray-500 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
                    >
                        <XCircle size={18} /> Clear
                    </button>
                </div>

                {/* --- SERVICE TABS --- */}
                <div className="flex flex-wrap gap-3 bg-gray-50 p-2 rounded-2xl">
                    {SERVICES.map((service) => (
                        <button
                            key={service.key}
                            onClick={() => setActiveService(service)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${
                                activeService.key === service.key
                                    ? "bg-white text-gray-900 shadow-md border border-gray-100 scale-[1.02]"
                                    : "text-gray-500 hover:text-gray-800 hover:bg-white/50"
                            }`}
                        >
                            <span className={activeService.key === service.key ? "text-[#8ed26b]" : "text-gray-400"}>
                                {service.icon}
                            </span>
                            {service.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-600 text-sm font-bold uppercase tracking-wider">
                                <th className="p-4">Customer</th>
                                <th className="p-4">Contact Details</th>
                                <th className="p-4">Date Received</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <Loader2 className="animate-spin text-[#8ed26b] w-10 h-10 mx-auto mb-2" />
                                        <span className="text-gray-500 font-medium">Loading Records...</span>
                                    </td>
                                </tr>
                            ) : filteredRows.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-500 text-lg">No requests found.</td>
                                </tr>
                            ) : (
                                filteredRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#8ed26b]/10 text-[#8ed26b] flex items-center justify-center font-bold">
                                                    {row[activeService.nameKey]?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-800">{row[activeService.nameKey]}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail size={14} className="text-gray-400" /> {row[activeService.emailKey] || "N/A"}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                                    <Phone size={14} /> {row[activeService.phoneKey]}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Calendar size={14} /> 
                                                {new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="relative w-40">
                                                <select
                                                    value={row.status || "New"}
                                                    onChange={(e) => updateStatus(row.id, e.target.value)}
                                                    className={`w-full appearance-none border text-xs px-3 py-2 rounded-lg font-bold uppercase tracking-wider shadow-sm outline-none cursor-pointer transition-all ${getStatusClasses(row.status || "New")}`}
                                                >
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <option key={s} value={s} className="bg-white text-gray-800">{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-2.5 pointer-events-none w-3.5 h-3.5 opacity-60" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setSelectedRow(row)}
                                                className="p-2 text-gray-400 hover:text-[#8ed26b] hover:bg-gray-100 rounded-full transition-all"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- DETAIL MODAL --- */}
            {selectedRow && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                <FileText className="mr-3 text-[#8ed26b]" /> Request Details
                            </h3>
                            <button onClick={() => setSelectedRow(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                            {Object.entries(selectedRow).map(([key, value]) => (
                                <div key={key} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{key.replace(/_/g, ' ')}</p>
                                    <p className="text-sm font-bold text-gray-700">{String(value || "—")}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
