import { UserCircle2, Wallet, LogOut, ShieldAlert } from 'lucide-react'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  }

  // Helper to determine active link
  const isActive = (path) => {
    return location.pathname === path ? "text-blue-600 font-bold border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600";
  };

  if (!user) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-50">
      <div 
        className="flex items-center space-x-3 text-blue-700 font-black text-2xl cursor-pointer hover:scale-105 transition-transform"
        onClick={() => navigate("/dashboard")}
      >
        <div className="bg-blue-700 p-2 rounded-lg">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
          BankOfJonathan
        </span>
      </div>

      <ul className="hidden md:flex space-x-8 font-medium text-sm tracking-wide">
        <li className={`cursor-pointer transition pb-1 ${isActive("/dashboard")}`}
            onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li className={`cursor-pointer transition pb-1 ${isActive("/dashboard/transaction")}`}
            onClick={() => navigate("/dashboard/transaction")}>Transactions</li>
        <li className={`cursor-pointer transition pb-1 ${isActive("/dashboard/goals")}`}
            onClick={() => navigate("/dashboard/goals")}>Goals</li>
        
        {user.role === 'admin' && (
          <li className={`cursor-pointer transition pb-1 flex items-center gap-1 ${isActive("/dashboard/admin")}`}
              onClick={() => navigate("/dashboard/admin")}>
            <ShieldAlert className="w-4 h-4" /> Admin Panel
          </li>
        )}
      </ul>

      <div className="flex items-center space-x-4">
        <div 
          onClick={() => navigate("/dashboard/profile")}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 cursor-pointer px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
        >
          <UserCircle2 className="w-6 h-6 text-gray-600" />
          <span className="text-gray-800 font-semibold text-sm">{user?.firstName}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar