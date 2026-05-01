"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Pencil, Trash2, Search } from "lucide-react";
import { useAdminToast } from "@/components/AdminToast";

type CategoryItem = {
  id: number;
  category: string;
  description?: string | null;
};

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const { addToast } = useAdminToast();

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CategoryItem | null>(null);
  const [originalEditItem, setOriginalEditItem] = useState<CategoryItem | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<CategoryItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCategories = async (q = "", filter = "All") => {
    setLoading(true);
    let query = supabase
      .from("categories")
      .select("id, category, description")
      .order("id", { ascending: false });

    if (q.trim()) query = query.ilike("category", `%${q}%`);
    if (filter !== "All") query = query.eq("category", filter);

    const { data, error } = await query;
    if (!error) setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories(debouncedSearch, filterCategory);
  }, [debouncedSearch, filterCategory]);

  const uniqueCategories = Array.from(new Set(categories.map((c) => c.category))).sort();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!categoryName.trim() || !description.trim()) {
      addToast("Name and Description are required.", "error");
      setSubmitting(false);
      return;
    }

    const duplicate = categories.find(
      (c) => c.category.toLowerCase() === categoryName.trim().toLowerCase()
    );
    if (duplicate) {
      addToast("This category already exists.", "error");
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("categories").insert([
        { category: categoryName, description },
      ]);

      if (error) throw error;

      addToast("Category added successfully!", "success");
      setCategoryName("");
      setDescription("");
      fetchCategories();
    } catch (err: any) {
      addToast(err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item: CategoryItem) => {
    setEditItem(item);
    setOriginalEditItem({ ...item });
    setEditModalOpen(true);
  };

  const isEditChanged = () => {
    if (!editItem || !originalEditItem) return false;
    return (
      editItem.category.trim() !== originalEditItem.category?.trim() ||
      (editItem.description ?? "") !== (originalEditItem.description ?? "")
    );
  };

  const handleDeleteCategory = async () => {
    if (!deleteItem) return;
    setDeletingId(deleteItem.id);
    await supabase.from("categories").delete().eq("id", deleteItem.id);
    fetchCategories(search, filterCategory);
    addToast("Category deleted successfully!", "success");
    setDeletingId(null);
    setDeleteModalOpen(false);
    setDeleteItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Category Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE: List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-md p-5 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#8ed26b] outline-none"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8ed26b] bg-white"
            >
              <option value="All">All</option>
              {uniqueCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-white p-6 shadow-md rounded-2xl flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{c.category}</h2>
                    <p className="text-gray-600">{c.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(c)} className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-[#8ed26b]/20 hover:text-[#8ed26b]">
                      <Pencil size={18} />
                    </button>
                    <button 
                      disabled={deletingId === c.id}
                      onClick={() => { setDeleteItem(c); setDeleteModalOpen(true); }} 
                      className="p-2 bg-gray-100 rounded-lg text-red-500 hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Add Form */}
        <form onSubmit={handleAddCategory} className="bg-white shadow-xl rounded-3xl p-7 space-y-5 h-fit">
          <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
          <div>
            <label className="font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#8ed26b] outline-none"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#8ed26b] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#8ed26b] hover:bg-[#6ebb53] text-white py-3 rounded-xl font-semibold transition"
          >
            {submitting ? "Saving..." : "Add Category"}
          </button>
        </form>
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && editItem && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editItem.category}
                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                className="w-full border rounded-xl p-3"
              />
              <textarea
                rows={3}
                value={editItem.description ?? ""}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                className="w-full border rounded-xl p-3"
              />
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    await supabase.from("categories").update({
                      category: editItem.category,
                      description: editItem.description,
                    }).eq("id", editItem.id);
                    fetchCategories(search, filterCategory);
                    setEditModalOpen(false);
                    addToast("Updated!", "success");
                  }}
                  disabled={!isEditChanged()}
                  className="flex-1 py-3 bg-[#8ed26b] text-white rounded-xl disabled:bg-gray-300"
                >
                  Update
                </button>
                <button onClick={() => setEditModalOpen(false)} className="flex-1 py-3 bg-gray-200 rounded-xl">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL (Simplified) */}
      {deleteModalOpen && deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-7 rounded-2xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Delete Category?</h2>
            <p className="mb-6 text-gray-600">This will permanently remove <strong>{deleteItem.category}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-2 bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleDeleteCategory} className="flex-1 py-2 bg-red-500 text-white rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}