import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchema";
import useAuthStore from "../store/useAuthStore";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, LogIn, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [globalError, setGlobalError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setGlobalError(null);
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/dashboard");
    } else {
      setGlobalError(useAuthStore.getState().error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 relative overflow-hidden font-sans p-4">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      {/* Back to Home Navigation */}
      <nav className="absolute top-0 w-full z-50 flex items-center px-6 py-5">
        <Link to="/" className="flex items-center space-x-2 text-white/70 hover:text-white transition group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium tracking-wide">Back to Home</span>
        </Link>
      </nav>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-4 shadow-inner">
            <Wallet className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-blue-100/70 mt-2 text-sm text-center">Enter your details to access your account securely.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {globalError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center"
            >
              {globalError}
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="text-blue-100/90 text-sm font-medium ml-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`w-full bg-white/5 border ${errors.email ? "border-red-400/50" : "border-white/10"} text-white placeholder:text-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            />
            {errors.email && <p className="text-red-400 text-xs ml-1 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-blue-100/90 text-sm font-medium ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full bg-white/5 border ${errors.password ? "border-red-400/50" : "border-white/10"} text-white placeholder:text-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            />
            {errors.password && <p className="text-red-400 text-xs ml-1 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? "Authenticating..." : (
              <>
                <span>Sign In</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-300 hover:text-white font-medium transition-colors hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
