import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Activity, IndianRupee, MapPin, Phone, Mail, ShieldAlert } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const user = useAuthStore(state => state.user);

  if (user?.role !== "admin") {
    // Redirect unauthorized users
    return <Navigate to="/dashboard" replace />;
  }

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    }
  });

  const { data: usersList, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full z-10">
        
        <div className="flex items-center gap-3 mb-8">
          <ShieldAlert className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">System Admin Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: "Total Users", value: stats?.totalUsers || 0, icon: <Users className="w-6 h-6 text-blue-600" />, load: statsLoading },
            { title: "System Balance", value: `₹${(stats?.totalSystemBalance || 0).toLocaleString()}`, icon: <IndianRupee className="w-6 h-6 text-emerald-600" />, load: statsLoading },
            { title: "Transactions Count", value: stats?.totalTransactionsCount || 0, icon: <Activity className="w-6 h-6 text-rose-600" />, load: statsLoading },
            { title: "Total Money Moved", value: `₹${(stats?.totalMoneyMoved || 0).toLocaleString()}`, icon: <IndianRupee className="w-6 h-6 text-indigo-600" />, load: statsLoading },
          ].map((stat, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{stat.title}</p>
                {stat.load ? (
                   <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                   <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                )}
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Users Table */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-900/5 border border-white">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
             <Users className="w-5 h-5 text-blue-500" /> User Directory
          </h2>
          
          <div className="overflow-x-auto">
            {usersLoading ? (
              <div className="flex justify-center p-10">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">User</th>
                    <th className="py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">Contact</th>
                    <th className="py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider">Role</th>
                    <th className="py-4 px-4 text-gray-500 font-semibold text-sm uppercase tracking-wider text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList?.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition whitespace-nowrap">
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-indigo-500 font-mono mt-0.5">{u._id}</div>
                      </td>
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-3.5 h-3.5" /> {u.email}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-3.5 h-3.5" /> {u.phone || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-gray-900">₹{u.balance.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                  {usersList?.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-500">No users found in the system.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
