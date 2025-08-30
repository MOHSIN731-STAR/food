"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { verifyOtp } from "../../redux/store/verifyOtpSlice";

import { useRouter } from "next/navigation";
import Link from "next/link";
const OtpVerify: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.verifyOtp
  );
  const router = useRouter();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft > 0) {
      const res = await dispatch(verifyOtp(otp));

      if (verifyOtp.fulfilled.match(res)) {
        // ✅ Role localStorage se lo
        const role = localStorage.getItem("pendingRole") || "user";

        if (role === "admin") {
          router.push("/component/AdminPanel");
        } else {
          router.push("/component/Menu");
        }

        // ✅ Clear pendingRole (optional)
        localStorage.removeItem("pendingRole");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded-lg"
            required
            disabled={timeLeft === 0}
          />
          <button
            type="submit"
            disabled={loading || timeLeft === 0}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading
              ? "Verifying..."
              : timeLeft > 0
              ? `Verify OTP (${timeLeft}s)`
              : "OTP Expired"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        {timeLeft === 0 && !user && (
          <p className="text-red-500 text-center mt-2">
             OTP expired, request a new one.
          </p>
        )}

      </div>
    </div>
  );
};

export default OtpVerify;
