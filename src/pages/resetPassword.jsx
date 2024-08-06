import React, { useState, useEffect } from "react";

import { useMutation } from "@tanstack/react-query";
import { resetPassword, sendOtp } from "../services/user";
import { useMutationHook } from "../hooks/useMutationHook";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../components/header.jsx";


const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sendOtpMutation = useMutationHook((data) => sendOtp(data));
  const resetPasswordMutation = useMutationHook((data) => resetPassword(data));

  const handleSendOtp = () => {
    console.log("Sending OTP to:", email);
    sendOtpMutation.mutate({ email, newPassword });
  };

  const handleResetPasswordClick = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    console.log("Resetting password for:", email);
    resetPasswordMutation.mutate({ email, otp, newPassword });
  };

  useEffect(() => {
    if (sendOtpMutation.isSuccess) {
      setStep(2);
    }
  }, [sendOtpMutation.isSuccess]);

  useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      toast.success("Password reset successfully");
      setStep(1);
    }
  }, [resetPasswordMutation.isSuccess]);

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-slate-400">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-center text-primary">
                Forgot Password
              </h2>
              <p className="text-muted-foreground text-center mb-4">
                Please enter your email address and new password to send OTP to
                your email
              </p>
              <input
                type="email"
                placeholder="Your e-mail address"
                className="w-full p-2 border border-border rounded mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-2 border border-border rounded mb-4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className="bg-black text-rose-50 text-primary-foreground hover:bg-primary/80 w-full p-2 rounded"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center text-primary">
                Reset Password
              </h2>
              <p className="text-muted-foreground text-center mb-4">
                Please enter the OTP sent to your email and confirm your new
                password
              </p>
              <input
                type="text"
                placeholder="OTP"
                className="w-full p-2 border border-border rounded mb-4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-2 border border-border rounded mb-4"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleResetPasswordClick}
                className="bg-black text-rose-50 text-primary-foreground hover:bg-primary/80 w-full p-2 rounded"
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
