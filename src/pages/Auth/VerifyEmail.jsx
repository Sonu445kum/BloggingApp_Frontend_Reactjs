import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyToken({
  endpoint = "/api/auth/verify-email/",
  successMessage = "Action completed successfully!",
  redirectTo = "/auth/login",
  loadingMessage = "Processing..."
}) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ success: false, message: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const uid = searchParams.get("uid");
      const token = searchParams.get("token");

      if (!uid || !token) {
        const msg = "Invalid or missing parameters!";
        toast.error(msg);
        setStatus({ success: false, message: msg });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}?uid=${uid}&token=${token}`
        );
        const data = await res.json();

        if (res.ok) {
          const msg = data.message || successMessage;
          setStatus({ success: true, message: msg });
          toast.success(msg);
          setTimeout(() => navigate(redirectTo), 3000);
        } else {
          const msg = data.error || "Action failed!";
          setStatus({ success: false, message: msg });
          toast.error(msg);
        }
      } catch (err) {
        const msg = "Something went wrong!";
        setStatus({ success: false, message: msg });
        toast.error(msg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate, endpoint, successMessage, redirectTo]);

  const renderMessage = () => {
    if (loading) return <p className="text-blue-600">{loadingMessage}</p>;
    if (status.success) return <p className="text-green-600">{status.message} Redirecting...</p>;
    return <p className="text-red-600">{status.message}</p>;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        {renderMessage()}
      </div>
    </div>
  );
}
