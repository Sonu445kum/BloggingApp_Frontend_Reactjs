import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff } from "react-icons/hi";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  // ✅ Password validation rules
  const passwordRules = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const strengthScore = Object.values(passwordRules).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (strengthScore <= 1) return "Weak";
    if (strengthScore === 2 || strengthScore === 3) return "Medium";
    if (strengthScore === 4) return "Strong";
  };

  const getStrengthColor = () => {
    if (strengthScore <= 1) return "bg-red-500";
    if (strengthScore === 2 || strengthScore === 3) return "bg-yellow-500";
    if (strengthScore === 4) return "bg-green-500";
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("🎉 Password reset successful!");
        setTimeout(() => navigate("/auth/login"), 1200);
      } else {
        toast.error(data.detail || "Reset failed. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <motion.form
        onSubmit={handleResetPassword}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          🔑 Reset Your Password
        </h2>

        {/* Password Field */}
        <div className="mb-4 relative">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </span>

          {/* Strength bar */}
          {password && (
            <>
              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className={`h-2 rounded ${getStrengthColor()}`}
                  style={{ width: `${(strengthScore / 4) * 100}%` }}
                ></div>
              </div>
              <p
                className={`text-sm mt-1 font-medium ${
                  getStrengthColor() === "bg-red-500"
                    ? "text-red-500"
                    : getStrengthColor() === "bg-yellow-500"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Strength: {getStrengthLabel()}
              </p>
            </>
          )}

          {/* Live validation tips */}
          {password && (
            <ul className="text-xs mt-2 space-y-1">
              <li
                className={
                  passwordRules.length ? "text-green-500" : "text-red-500"
                }
              >
                • At least 6 characters
              </li>
              <li
                className={
                  passwordRules.uppercase ? "text-green-500" : "text-red-500"
                }
              >
                • At least 1 uppercase letter
              </li>
              <li
                className={
                  passwordRules.number ? "text-green-500" : "text-red-500"
                }
              >
                • At least 1 number
              </li>
              <li
                className={
                  passwordRules.symbol ? "text-green-500" : "text-red-500"
                }
              >
                • At least 1 special character
              </li>
            </ul>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6 relative">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          type="submit"
          className={`w-full p-2 rounded-md text-white font-medium transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </motion.button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/auth/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default ResetPassword;
