import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warn("Please enter your email!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/forgot-password/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Password reset link sent to your email!");
        setEmail("");
      } else {
        toast.error(data.detail || "Error sending reset link");
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-[380px]"
      >
        <motion.h2
          className="text-2xl font-semibold text-center text-gray-800 mb-6"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Forgot Your Password?
        </motion.h2>

        <motion.form
          onSubmit={handleForgotPassword}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Enter your registered email
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full p-3 mb-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-3 rounded-lg transition-all duration-300`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </motion.form>

        <motion.p
          className="text-sm text-center text-gray-600 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Back to Login
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
