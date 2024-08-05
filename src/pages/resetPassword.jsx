import React from "react";

const ResetPassword = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-400">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center text-primary">Forgot Password</h2>
                <p className="text-muted-foreground text-center mb-4">Please enter your email address to reset your password</p>
                <input type="email" placeholder="Your e-mail address" className="w-full p-2 border border-border rounded mb-4" />
                <button className="bg-black text-rose-50 text-primary-foreground hover:bg-primary/80 w-full p-2 rounded">Reset my Password</button>
            </div>
        </div>
    )
}

export default ResetPassword;