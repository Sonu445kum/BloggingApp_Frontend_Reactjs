import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [strength, setStrength] = useState({ label: "", color: "" });
  const [showTooltip, setShowTooltip] = useState(false);

  // ✅ Check password strength
  const evaluateStrength = (password) => {
    if (!password) return { label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return { label: "Weak", color: "bg-red-500" };
      case 2:
        return { label: "Medium", color: "bg-yellow-500" };
      case 3:
      case 4:
        return { label: "Strong", color: "bg-green-500" };
      default:
        return { label: "", color: "" };
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setStrength(evaluateStrength(value));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("⚠️ Please login first!");
      return;
    }

    if (!oldPassword || !newPassword) {
      toast.warn("Please fill in both fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setStrength({ label: "", color: "" });
      } else {
        toast.error(data.detail || "❌ Failed to change password");
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-100 via-white to-indigo-100">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-[380px] relative"
      >
        <motion.h2
          className="text-2xl font-semibold text-center text-gray-800 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Change Your Password 🔒
        </motion.h2>

        <motion.form
          onSubmit={handleChangePassword}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Old Password */}
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Old Password
          </label>
          <input
            type={showPasswords ? "text" : "password"}
            placeholder="Enter old password"
            className="w-full p-3 mb-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          {/* New Password + Tooltip */}
          <div className="flex items-center justify-between">
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              New Password
            </label>
            <button
              type="button"
              className="text-xs text-indigo-600 underline"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Requirements
            </button>
          </div>

          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />

            {/* 🧠 Tooltip Animation */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-[-100px] bg-indigo-50 text-gray-700 p-3 rounded-xl shadow-lg w-72 text-sm z-10"
                >
                  <p className="font-medium mb-2 text-indigo-700">
                    Password must contain:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One number (0–9)</li>
                    <li>One special symbol (!@#$%)</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ✅ Password Strength Meter */}
          {strength.label && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <motion.div
                  className={`h-2 rounded-full ${strength.color}`}
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      strength.label === "Weak"
                        ? "33%"
                        : strength.label === "Medium"
                        ? "66%"
                        : "100%",
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p
                className={`text-sm font-medium ${
                  strength.label === "Weak"
                    ? "text-red-600"
                    : strength.label === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                Password Strength: {strength.label}
              </p>
            </div>
          )}

          {/* Toggle Password Visibility */}
          <div className="flex items-center justify-between mb-6">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={() => setShowPasswords(!showPasswords)}
              />
              Show Passwords
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold py-3 rounded-lg transition-all duration-300`}
          >
            {loading ? "Updating..." : "Change Password"}
          </motion.button>
        </motion.form>

        <motion.p
          className="text-sm text-center text-gray-600 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Want to go back?{" "}
          <a href="/profile" className="text-indigo-600 hover:underline font-medium">
            Back to Profile
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
