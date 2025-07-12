"use client";


import Link from "next/link";
import { useState, useRef } from "react";

export default function Signup() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const formref= useRef<HTMLFormElement>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setSubmitted(true);
    const formData = new FormData(e.currentTarget)
    const res = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
      })
    })
    if (res.ok) {
      setSubmitted(true);
      setError("");
    }
    else{
      setError("Signup failed. Please try again.");
      setSubmitted(false);
      setTimeout(() => {
        setError("");
      }, 5000);
      formref.current?.reset(); // Reset the form fields
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create a New Account
        </h2>

        {submitted ? (
          <p className="text-green-600 font-medium text-center">
            ✅ Account created successfully (demo only)
          </p>
        ) : (
          <form ref={formref} onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm mt-2 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Create Account
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
