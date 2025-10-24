import React, { useState } from "react";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import { useForgotPasswordMutation } from "../../api/apiSlice"; // ✅ Correct hook name

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your email");
    }

    setLoading(true);
    try {
      await forgotPassword({ email }).unwrap();
      toast.success(
        "If an account with that email exists, we've sent password reset instructions."
      );
      setEmail("");
    } catch (err) {
      toast.error(
        err?.data?.error || "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex justify-center items-center relative bg-gray-100">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1470')",
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-2xl z-10">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Reset Your Password
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Enter the email associated with your account. We'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold flex justify-center items-center gap-2"
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
              Remembered your password?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => (window.location.href = "/auth/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
