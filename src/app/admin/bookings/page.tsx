"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Search, User, Phone, X, Calendar, DollarSign, Clock, Eye, Download } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
{/* --- FILTER CARD --- */ }
import { ChevronDown, XCircle } from "lucide-react";

type Booking = {
    id: number;
    order_no: string;
    razorpay_order_id?: string | null;
    user_id: string | null;
    customer_name: string;
    customer_mobile?: string | null; // Customer phone number
    service_name: string;
    service_types: string[];
    date: string;
    booking_time: string;
    total_price: number;
    status: string;
    created_at: string;
    address: string | null;
    employee_name?: string | null;
    employee_phone?: string | null;
    payment_id?: string | null; // Added for payment status
};

// Define the authoritative list of status options and their order
const STATUS_OPTIONS = [
    "Pending",
    "Confirmed",
    "Arriving Today",
    "Work Done"
];

// Helper function for status colors
const getStatusClasses = (status: string) => {
    switch (status) {
        case "Pending":
            return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "Confirmed":
            return "bg-blue-100 text-blue-700 border-blue-300";
        case "Arriving Today":
            return "bg-purple-100 text-purple-700 border-purple-300";
        case "Work Done":
            return "bg-green-100 text-green-700 border-green-300";
        default:
            return "bg-gray-100 text-gray-700 border-gray-300";
    }
};

// Helper function for payment status colors
const getPaymentStatusClasses = (paymentId: string | null | undefined) => {
    if (paymentId) {
        return "bg-green-100 text-green-700 border border-green-300";
    } else {
        return "bg-red-100 text-red-700 border border-red-300";
    }
};

// =========================================================================
// BOOKINGS PAGE COMPONENT
// =========================================================================

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filtered, setFiltered] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [paymentFilter, setPaymentFilter] = useState("All Payment Status");
    const [serviceTypeFilter, setServiceTypeFilter] = useState("All Service Types");

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [employeeName, setEmployeeName] = useState("");
    const [employeePhone, setEmployeePhone] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [modalError, setModalError] = useState("");

    // --- VIEW DETAILS POPUP STATE ---
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [viewedBookingId, setViewedBookingId] = useState<number | null>(null);
    // -------------------

    const downloadExcel = () => {
        const dataToExport = filtered.map((b, index) => ({
            "S.No": index + 1,
            "Order No": b.order_no,
            "Razorpay Order ID": b.razorpay_order_id || "On Site Payment",
            "Customer Name": b.customer_name,
            "Customer Mobile": b.customer_mobile || "Not Provided",
            "User ID": b.user_id || "Guest",
            "Service Name": b.service_name,
            "Service Types": b.service_types.join(", "),
            "Booking Date": b.date,
            "Booking Time": b.booking_time,
            "Total Price (₹)": b.total_price,
            "Address": b.address || "Not Provided",
            "Employee Name": b.employee_name || "Not Assigned",
            "Employee Phone": b.employee_phone || "N/A",
            "Booking Status": b.status,
            "Payment Status": b.payment_id ? "Paid" : "Not Paid",
            "Created At": new Date(b.created_at).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "All Bookings");

        XLSX.writeFile(workbook, "Bookings_Full_Report.xlsx");
    };

    const downloadPDF = () => {
        const doc = new jsPDF("l", "pt", "a4"); // landscape for wide table

        doc.setFontSize(18);
        doc.text("Complete Bookings Report", 40, 40);

        const tableData = filtered.map((b, index) => [
            index + 1,
            b.order_no,
            b.razorpay_order_id || "On Site Payment",
            b.customer_name,
            b.customer_mobile || "N/A",
            b.service_name,
            b.service_types.join(", "),
            b.date,
            b.booking_time,
            `₹${b.total_price}`,
            b.address || "N/A",
            b.employee_name || "Not Assigned",
            b.employee_phone || "N/A",
            b.status,
            b.payment_id ? "Paid" : "Not Paid",
            new Date(b.created_at).toLocaleString(),
        ]);

        autoTable(doc, {
            startY: 70,
            head: [[
                "S.No",
                "Order No",
                "Razorpay ID",
                "Customer",
                "Mobile",
                "Service",
                "Types",
                "Date",
                "Time",
                "Price",
                "Address",
                "Employee",
                "Phone",
                "Status",
                "Payment",
                "Created At"
            ]],
            body: tableData,
            styles: {
                fontSize: 8,
                cellPadding: 4,
            },
            headStyles: {
                fillColor: [46, 204, 113], // green
                textColor: 255,
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { left: 40, right: 40 },
        });

        doc.save("Bookings_Full_Report.pdf");
    };

    // Download dynamic PDF receipt for a single booking details card
    const downloadSingleBookingPDF = (booking: Booking) => {
        const doc = new jsPDF("p", "pt", "a4");

        // Header Section
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, 595, 120, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(31, 41, 55);
        doc.text("Booking Invoice", 40, 55);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Order reference generated: ${new Date(booking.created_at).toLocaleString()}`, 40, 75);

        // Right aligned order meta details
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(71, 85, 105);
        doc.text(`ORDER NO: ${booking.order_no}`, 410, 55);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Status: ${booking.status}`, 410, 75);
        doc.text(`Payment: ${booking.payment_id ? "Paid" : "Unpaid"}`, 410, 92);

        // Booking Structure Table
        autoTable(doc, {
            startY: 150,
            head: [["Detail Field", "Information Values"]],
            body: [
                ["Customer Name", booking.customer_name],
                ["Customer Mobile", booking.customer_mobile || "Not Provided"],
                ["Service Requested", booking.service_name],
                ["Selected Sub-Categories / Types", booking.service_types.join(", ")],
                ["Execution Date", booking.date],
                ["Preferred Time Slot", booking.booking_time],
                ["Payment Reference ID", booking.razorpay_order_id || "On Site Payment Option"],
                ["Installation / Work Address", booking.address || "No custom destination address provided"],
                ["Assigned Employee Name", booking.employee_name || "Unassigned / Pending staff setup"],
                ["Employee Contact Line", booking.employee_phone || "Not Available"],
            ],
            theme: "striped",
            headStyles: { fillColor: [79, 70, 229], fontStyle: "bold" },
            styles: { fontSize: 11, cellPadding: 8, overflow: "linebreak" },
            columnStyles: {
                0: { cellWidth: 160, fontStyle: "bold", textColor: [71, 85, 105] },
                1: { textColor: [15, 23, 42] }
            }
        });

        // Price Breakouts
        const currentY = (doc as any).lastAutoTable.finalY + 40;
        doc.setLineWidth(1);
        doc.setDrawColor(226, 232, 240);
        doc.line(40, currentY, 555, currentY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text("Total Gross Amount Due:", 320, currentY + 30);

        doc.setTextColor(22, 163, 74);
        doc.setFontSize(16);
        doc.text(`INR ${booking.total_price.toFixed(2)}`, 480, currentY + 30);

        doc.save(`Invoice_${booking.order_no}.pdf`);
    };


    // Fetches initial data
    const fetchBookings = async () => {
        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .order("id", { ascending: false });

        if (!error) {
            setBookings(data || []);
            setFiltered(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Filter/Search Logic
    useEffect(() => {
        let results = bookings;

        if (search.trim() !== "") {
            const query = search.toLowerCase();
            results = results.filter(
                (b) =>
                    (b.customer_name?.toLowerCase() || "").includes(query) ||
                    (b.service_name?.toLowerCase() || "").includes(query) ||
                    (b.order_no?.toLowerCase() || "").includes(query) ||
                    (b.customer_mobile?.toLowerCase() || "").includes(query)
            );
        }

        if (statusFilter !== "All Status") {
            results = results.filter((b) => b.status === statusFilter);
        }

        if (paymentFilter !== "All Payment Status") {
            if (paymentFilter === "Paid") {
                results = results.filter((b) => b.payment_id);
            } else if (paymentFilter === "Not Paid") {
                results = results.filter((b) => !b.payment_id);
            }
        }

        if (serviceTypeFilter !== "All Service Types") {
            results = results.filter((b) => b.service_types.includes(serviceTypeFilter));
        }

        setFiltered(results);
    }, [search, statusFilter, paymentFilter, serviceTypeFilter, bookings]);

    // Status Change Handler (opens modal if 'Arriving Today')
    const handleStatusChange = (id: number, status: string) => {
        if (status === "Arriving Today") {
            const booking = bookings.find(b => b.id === id);
            // Pre-populate fields if employee is already assigned
            setEmployeeName(booking?.employee_name || "");
            setEmployeePhone(booking?.employee_phone || "");

            setSelectedBookingId(id);
            setNewStatus(status);
            setModalError(""); // Clear previous errors
            setIsModalOpen(true);
        } else {
            // For all other status changes, update immediately
            updateStatus(id, status);
        }
    };

    // Function to handle modal submission
    const assignEmployeeAndProceed = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBookingId) return;

        if (!employeeName.trim() || !employeePhone.trim()) {
            setModalError("Employee Name and Phone are required to set status to 'Arriving Today'.");
            return;
        }

        updateStatus(selectedBookingId, newStatus, employeeName, employeePhone);

        // Close and reset modal state
        setIsModalOpen(false);
        setSelectedBookingId(null);
        setEmployeeName("");
        setEmployeePhone("");
        setNewStatus("");
    };

    // Core Update Function
    const updateStatus = async (
        id: number,
        status: string,
        name: string | null = null,
        phone: string | null = null
    ) => {
        const updateData: {
            status: string;
            employee_name?: string | null;
            employee_phone?: string | null;
        } = { status };

        // Only update employee fields if provided (i.e., coming from the modal)
        if (name !== null) updateData.employee_name = name;
        if (phone !== null) updateData.employee_phone = phone;

        // Supabase Update
        const { error } = await supabase
            .from("bookings")
            .update(updateData)
            .eq("id", id);

        // Local State Update
        if (!error) {
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === id
                        ? {
                            ...b,
                            status: status,
                            employee_name: name ?? b.employee_name, // Use existing if not updated
                            employee_phone: phone ?? b.employee_phone, // Use existing if not updated
                        }
                        : b
                )
            );
        } else {
            console.error("Error updating booking:", error);
            alert("Failed to update booking status.");
        }
    };

    // Function to mark payment as paid
    const markAsPaid = async (id: number) => {
        const { error } = await supabase
            .from("bookings")
            .update({ payment_id: "on-site-paid" }) // Set a dummy value to indicate paid
            .eq("id", id);

        if (!error) {
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === id
                        ? { ...b, payment_id: "on-site-paid" }
                        : b
                )
            );
        } else {
            console.error("Error updating payment status:", error);
            alert("Failed to update payment status.");
        }
    };

    // Helper function to determine if an option should be disabled
    const isStatusDisabled = (currentStatus: string, option: string): boolean => {
        const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);
        const optionIndex = STATUS_OPTIONS.indexOf(option);

        // Disable any option whose index is less than the current status index (i.e., previous steps)
        return optionIndex < currentIndex;
    };

    const selectedBooking = bookings.find(b => b.id === selectedBookingId);
    const detailBooking = bookings.find(b => b.id === viewedBookingId);

    return (
        <div className="p-4 md:p-8 min-h-screen bg-gray-50 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Booking Management Dashboard
                </h1>

                <div className="flex gap-3">
                    <button
                        onClick={downloadExcel}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium shadow hover:bg-green-700"
                    >
                        Download Excel
                    </button>

                    <button
                        onClick={downloadPDF}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow hover:bg-red-700"
                    >
                        Download PDF
                    </button>
                </div>
            </div>


            {/* --- FILTER CARD --- */}
            <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-gray-100"> {/* Reduced p-8 to p-6 */}
                <div className="flex justify-between items-center mb-4"> {/* Reduced mb-6 to mb-4 */}
                    <h2 className="text-xl font-bold text-gray-800">
                        Filter & Search
                    </h2>
                    <div className="px-4 py-1.5 bg-gray-50 rounded-full text-sm font-semibold text-instafitcore-green-hover border border-gray-100">
                        Total Bookings: {loading ? "..." : bookings.length}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"> {/* Added sm:grid-cols-2 */}
                    {/* 1. Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search name, phone, order..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-instafitcore-green focus:border-instafitcore-green outline-none transition-all"
                        />
                    </div>

                    {/* 2. Status Filter with Down Arrow */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-instafitcore-green focus:border-instafitcore-green outline-none cursor-pointer text-gray-700"
                        >
                            <option>All Status</option>
                            {STATUS_OPTIONS.map((s) => (
                                <option key={`filter-${s}`} value={s}>{s}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>

                    {/* 3. Payment Status Filter with Down Arrow */}
                    <div className="relative">
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-instafitcore-green focus:border-instafitcore-green outline-none cursor-pointer text-gray-700"
                        >
                            <option>All Payment Status</option>
                            <option>Paid</option>
                            <option>Not Paid</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>

                    {/* 4. Service Type Filter with Down Arrow */}
                    <div className="relative">
                        <select
                            value={serviceTypeFilter}
                            onChange={(e) => setServiceTypeFilter(e.target.value)}
                            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-instafitcore-green focus:border-instafitcore-green outline-none cursor-pointer text-gray-700"
                        >
                            <option>All Service Types</option>
                            <option>Installation</option>
                            <option>Dismantle</option>
                            <option>Repair</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>

                    {/* 5. Action Button */}
                    <button
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("All Status");
                            setPaymentFilter("All Payment Status");
                            setServiceTypeFilter("All Service Types");
                        }}
                        className="w-full py-2.5 text-gray-500 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 transition-all flex items-center justify-center gap-2"
                    >
                        <XCircle size={18} />
                        Clear Filters
                    </button>
                </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* --- TABLE --- */}
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-x-auto">
                <table className="w-full text-left border-collapse"> {/* Changed min-w-full to w-full */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-gray-600 text-sm font-bold uppercase tracking-wider">
                            <th className="p-4">Order No</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Razorpay Order ID</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4 text-right">Price</th>
                            <th className="p-4">Assigned Employee</th>
                            <th className="p-4 text-center">Payment Status</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 divide-y divide-gray-100">
                        {loading || filtered.length === 0 ? (
                            <tr><td colSpan={11} className="p-10 text-center text-gray-500 text-lg">{loading ? "Loading bookings..." : "No bookings found matching filters."}</td></tr>
                        ) : (
                            filtered.map((b) => (
                                <tr key={b.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                                    <td className="p-4 font-mono text-sm text-gray-700 whitespace-nowrap">
                                        {b.order_no}
                                    </td>
                                    <td className="p-4 font-semibold">
                                        {b.customer_name}
                                        {b.customer_mobile && (
                                            <div className="flex items-center space-x-1 text-xs text-blue-600 font-normal mt-1">
                                                <Phone className="w-3 h-3" />
                                                <span>{b.customer_mobile}</span>
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 font-normal mt-0.5">Types: {b.service_types.join(", ")}</div>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-gray-600 whitespace-nowrap">
                                        {b.razorpay_order_id ? (
                                            b.razorpay_order_id
                                        ) : (
                                            <span className="text-gray-400 italic">On Site Payment</span>
                                        )}
                                    </td>

                                    <td className="p-4 font-medium">{b.service_name}</td>
                                    <td className="p-4 text-sm whitespace-nowrap">
                                        <div className="flex items-center space-x-1 text-gray-600">
                                            <Calendar className="w-3 h-3" /> <span>{b.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-gray-600">
                                            <Clock className="w-3 h-3" /> <span className="font-medium">{b.booking_time}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-extrabold text-lg text-green-600 text-right whitespace-nowrap">
                                        ₹{b.total_price.toFixed(2)}
                                    </td>

                                    {/* Employee Details Column */}
                                    <td className="p-4">
                                        {b.employee_name ? (
                                            <div className="text-sm space-y-1">
                                                <div className="flex items-center space-x-1 text-gray-700">
                                                    <User className="w-4 h-4" />
                                                    <span className="font-semibold">{b.employee_name}</span>
                                                </div>
                                                <div className="flex items-center space-x-1 text-blue-600">
                                                    <Phone className="w-4 h-4" />
                                                    <span className="text-xs">{b.employee_phone}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-red-500 font-medium text-xs border border-red-300 bg-red-50 px-2 py-0.5 rounded-full">Not Assigned</span>
                                        )}
                                    </td>

                                    {/* Payment Status Column */}
                                    <td className="p-4 text-center">
                                        {b.payment_id ? (
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPaymentStatusClasses(b.payment_id)}`}>
                                                Paid
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => markAsPaid(b.id)}
                                                className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-colors"
                                            >
                                                Mark as Paid
                                            </button>
                                        )}
                                    </td>

                                    {/* Status Dropdown with Controlled Flow */}
                                    <td className="p-4 text-center">
                                        <select
                                            value={b.status}
                                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                            className={`border text-sm px-2 py-1.5 rounded-lg font-medium shadow-sm outline-none transition-all duration-200 ${getStatusClasses(b.status)}`}
                                        >
                                            {STATUS_OPTIONS.map((statusOption) => (
                                                <option
                                                    key={statusOption}
                                                    value={statusOption}
                                                    disabled={isStatusDisabled(b.status, statusOption)}
                                                    className={isStatusDisabled(b.status, statusOption) ? "text-gray-400" : ""}
                                                >
                                                    {statusOption}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Action Eye Button Column */}
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => {
                                                setViewedBookingId(b.id);
                                                setIsDetailModalOpen(true);
                                            }}
                                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- EMPLOYEE ASSIGNMENT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all scale-100 ease-out duration-300">

                        {/* Header */}
                        <div className="flex justify-between items-start border-b pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                <User className="w-6 h-6 mr-2 text-[#8ed26b]" /> Assign Employee & Confirm
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={assignEmployeeAndProceed} className="space-y-5">
                            <p className="text-gray-600 mb-5">
                                Assign employee for Order No:{" "}
                                <strong className="font-mono">{selectedBooking?.order_no}</strong>
                            </p>

                            {/* Employee Name Input */}
                            <div>
                                <label htmlFor="employeeName" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Employee Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="employeeName"
                                    type="text"
                                    value={employeeName}
                                    onChange={(e) => setEmployeeName(e.target.value)}
                                    placeholder="e.g., Jane Smith"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#8ed26b] focus:border-[#8ed26b] transition-shadow"
                                    required
                                />
                            </div>

                            {/* Employee Phone Input */}
                            <div>
                                <label htmlFor="employeePhone" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Employee Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="employeePhone"
                                    type="tel"
                                    value={employeePhone}
                                    onChange={(e) => setEmployeePhone(e.target.value)}
                                    placeholder="e.g., 9876543210"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#8ed26b] focus:border-[#8ed26b] transition-shadow"
                                    required
                                />
                            </div>

                            {/* Error Message */}
                            {modalError && (
                                <p className="mt-4 text-sm font-medium text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl flex items-center">
                                    <X className="w-4 h-4 mr-2" /> {modalError}
                                </p>
                            )}

                            {/* Buttons */}
                            <div className="mt-8 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-[#8ed26b] text-white font-medium rounded-xl shadow-md hover:bg-[#6ebb53] transition-colors disabled:opacity-50"
                                >
                                    Confirm & Set Status to "{newStatus}"
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* --- DETAILED BOOKING POPUP --- */}
            {isDetailModalOpen && detailBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 duration-200 max-h-[90vh] flex flex-col">

                        {/* Popup Header */}
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <div>
                                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Booking Record</span>
                                <h3 className="text-xl font-bold flex items-center mt-1">
                                    Order ID: <span className="font-mono ml-2 text-indigo-400">{detailBooking.order_no}</span>
                                </h3>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => downloadSingleBookingPDF(detailBooking)}
                                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-medium border border-slate-700"
                                    title="Download Receipt Image/PDF"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Details</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        setViewedBookingId(null);
                                    }}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Popup Content Grid */}
                        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50 flex-1">

                            {/* Row 1: Status Badges */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Work Status</label>
                                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg border ${getStatusClasses(detailBooking.status)}`}>
                                        {detailBooking.status}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Payment Status</label>
                                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg ${getPaymentStatusClasses(detailBooking.payment_id)}`}>
                                        {detailBooking.payment_id ? "Paid Successfully" : "Pending Payment"}
                                    </span>
                                </div>
                            </div>

                            {/* Row 2: Customer and Service info */}
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-2 text-slate-500">Core Details</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 font-medium">Customer Name</p>
                                        <p className="text-base font-bold text-gray-900 mt-0.5">{detailBooking.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 font-medium">Customer Mobile</p>
                                        <p className="text-base font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                                            <Phone className="w-4 h-4 text-indigo-500" />
                                            {detailBooking.customer_mobile || "Not Provided"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 font-medium">Service Name</p>
                                        <p className="text-base font-bold text-gray-900 mt-0.5">{detailBooking.service_name}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-gray-500 font-medium">Service Categories</p>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {detailBooking.service_types.map((t, idx) => (
                                                <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Schedule & Address */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-2 text-slate-500">Schedule</h4>
                                    <div className="text-sm space-y-2">
                                        <div className="flex items-center space-x-2 text-gray-700">
                                            <Calendar className="w-4 h-4 text-indigo-500" />
                                            <span className="font-medium">Date:</span> <span>{detailBooking.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-700">
                                            <Clock className="w-4 h-4 text-indigo-500" />
                                            <span className="font-medium">Time Slot:</span> <span>{detailBooking.booking_time}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-700">
                                            <DollarSign className="w-4 h-4 text-green-500" />
                                            <span className="font-medium">Total Cost:</span> <span className="font-bold text-green-600 text-base">₹{detailBooking.total_price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-2 text-slate-500">Location Address</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed pt-1">
                                        {detailBooking.address || "No target address specified for this booking record."}
                                    </p>
                                </div>
                            </div>

                            {/* Row 4: Personnel Logistics */}
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-2 text-slate-500">Assigned Logistics Personnel</h4>
                                {detailBooking.employee_name ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                            <User className="w-5 h-5 text-indigo-500" />
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium">Employee Name</p>
                                                <p className="font-semibold text-gray-800">{detailBooking.employee_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                            <Phone className="w-5 h-5 text-indigo-500" />
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium">Contact Number</p>
                                                <p className="font-semibold text-gray-800">{detailBooking.employee_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 p-3 rounded-lg font-medium text-center">
                                        No structural work employee has been dispatched to handle this task layout yet.
                                    </p>
                                )}
                            </div>

                            {/* System Metadata Tracking Block */}
                            <div className="text-[11px] font-mono text-gray-400 text-center pt-2">
                                Database ID Row: {detailBooking.id} &bull; Gateway Signature: {detailBooking.razorpay_order_id || "N/A"} &bull; Created At System Clock: {new Date(detailBooking.created_at).toISOString()}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-4 bg-gray-100 border-t flex justify-end">
                            <button
                                onClick={() => {
                                    setIsDetailModalOpen(false);
                                    setViewedBookingId(null);
                                }}
                                className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
                            >
                                Dismiss Window
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}