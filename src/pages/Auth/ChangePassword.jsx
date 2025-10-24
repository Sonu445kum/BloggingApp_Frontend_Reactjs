import React, { useState } from "react";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import { useChangePasswordMutation } from "../../api/apiSlice";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [changePassword] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword.trim() || !newPassword.trim()) {
      return toast.error("Please fill in both fields");
    }

    setLoading(true);
    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword }).unwrap();
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(
        err?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex justify-center items-center bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Change Password
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
