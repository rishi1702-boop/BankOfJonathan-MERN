import React from "react";
import { UserCircle, Mail, Phone, MapPin, Hash, ShieldCheck, CreditCard, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import Aisidebar from "../components/Aisidebar";
import { motion } from "framer-motion";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Profile Data...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 -z-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3 -z-10 animate-blob animation-delay-2000"></div>

        <Aisidebar />
        
        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full z-10">
          
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">User Profile</h1>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column: Summary Card */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-white flex flex-col items-center text-center relative overflow-hidden group">
                {/* Accent Header */}
                <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                
                {/* Avatar */}
                <div className="relative z-10 w-28 h-28 bg-white rounded-full p-1.5 shadow-lg mt-8 mb-4">
                  <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                    <UserCircle className="w-16 h-16 text-blue-600" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                <div className="flex items-center justify-center gap-1 mt-1 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-semibold">Verified Account</span>
                </div>

                <div className="w-full mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4">
                   <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-start w-full border border-blue-100/50">
                     <span className="text-blue-600/70 text-sm font-medium flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Current Balance
                     </span>
                     <span className="text-3xl font-black text-gray-900 mt-1 tracking-tight">
                        ₹{(user.balance || 0).toLocaleString()}
                     </span>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Detailed Info Grid */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-white h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <UserCircle className="text-blue-500 w-6 h-6" /> Personal Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium uppercase tracking-wider">Email Address</span>
                    </div>
                    <p className="text-gray-900 font-semibold pl-[52px] truncate">{user.email}</p>
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Phone className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-sm font-medium uppercase tracking-wider">Phone Number</span>
                    </div>
                    <p className="text-gray-900 font-semibold pl-[52px]">{user.phone}</p>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors md:col-span-2">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <MapPin className="w-4 h-4 text-rose-500" />
                      </div>
                      <span className="text-sm font-medium uppercase tracking-wider">Registered Address</span>
                    </div>
                    <p className="text-gray-900 font-semibold pl-[52px]">{user.address}</p>
                  </div>

                  {/* Account ID */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100 md:col-span-2">
                    <div className="flex items-center gap-3 text-indigo-500 mb-2">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Hash className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium uppercase tracking-wider">Unique Account ID</span>
                    </div>
                    <p className="text-indigo-900 font-mono font-bold pl-[52px]">{user._id}</p>
                    <p className="text-indigo-600/70 text-xs pl-[52px] mt-1">Provide this ID for secure customer support inquiries.</p>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>

        </main>
      </div>
    </div>
  );
}
