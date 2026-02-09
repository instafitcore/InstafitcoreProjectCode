"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      setError("Invalid email or password");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] px-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <img
          src="/instlogo.png"
          alt="Instafit Core"
          className="w-56 md:w-64 object-contain mb-8"
        />

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 leading-tight">
          Admin Login
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center font-medium mb-3 bg-red-50 border border-red-200 px-3 py-2 rounded-lg w-full">
            {error}
          </p>
        )}

        {/* Inputs */}
        <div className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-[#8ed26b]"
          />

          {/* Password Input with Eye Icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 rounded-lg bg-white border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-[#8ed26b]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#8ed26b] hover:bg-[#78c15d] text-white py-3 
                       rounded-lg font-semibold shadow-md transition transform hover:-translate-y-1"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Instafit Core
        </p>
      </div>
    </div>
  );
}