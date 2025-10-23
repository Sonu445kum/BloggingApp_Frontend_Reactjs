import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const uid = searchParams.get("uid");
      const token = searchParams.get("token");

      if (!uid || !token) {
        toast.error("Invalid verification link");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-email/?uid=${uid}&token=${token}`
        );
        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
          toast.success(data.message || "Email verified successfully!");
          setTimeout(() => navigate("/auth/login"), 3000); // Redirect to login
        } else {
          toast.error(data.error || "Verification failed");
        }
      } catch (err) {
        toast.error("Something went wrong!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        {loading && <p className="text-blue-600">Verifying your email...</p>}
        {!loading && success && (
          <p className="text-green-600">Email verified successfully! Redirecting to login...</p>
        )}
        {!loading && !success && (
          <p className="text-red-600">Email verification failed. Please try again.</p>
        )}
      </div>
    </div>
  );
}
