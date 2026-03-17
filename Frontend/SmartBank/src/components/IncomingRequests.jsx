import React, { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { ArrowDownLeft, Check, X } from 'lucide-react';

export default function IncomingRequests() {
  const user = useAuthStore(state => state.user);
  const checkAuth = useAuthStore(state => state.checkAuth);
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  const pendingRequests = user?.moneyRequests?.filter(r => r.status === 'pending') || [];

  const handlePinChange = (value, index) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      document.getElementById(`pin-req-${index + 1}`).focus();
    }
  };

  const handleApproveClick = (req) => {
    setSelectedRequest(req);
    setShowPinModal(true);
  };

  const executeApproval = async () => {
    setLoading(true);
    try {
      await api.post('/payment/approve', {
        requestId: selectedRequest._id,
        pin: pin.join("")
      });
      checkAuth();
      setShowPinModal(false);
      setPin(["", "", "", ""]);
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    } finally {
      setLoading(false);
      setSelectedRequest(null);
    }
  };

  const executeDecline = async (reqId) => {
    setLoading(true);
    try {
      await api.post('/payment/decline', { requestId: reqId });
      checkAuth();
    } catch (error) {
      alert(error.response?.data?.message || "Decline failed");
    } finally {
      setLoading(false);
    }
  };

  if (pendingRequests.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
      <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
         <ArrowDownLeft className="w-5 h-5 text-emerald-600" /> Pending Requests
      </h2>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {pendingRequests.map(req => (
          <div key={req._id} className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{req.fromUserName} is requesting <span className="text-emerald-600">₹{req.amount.toLocaleString()}</span></p>
              <p className="text-xs text-gray-500 mt-1 italic">"{req.description || 'No description'}"</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => executeDecline(req._id)}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                title="Decline"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleApproveClick(req)}
                disabled={loading}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1 shadow-sm"
              >
                <Check className="w-4 h-4" /> Approve
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPinModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">Confirm Approval</h2>
            <p className="text-center text-sm text-gray-500 mb-4">Enter PIN to send ₹{selectedRequest?.amount} to {selectedRequest?.fromUserName}</p>
            <div className="flex justify-center gap-3 mb-6">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-req-${index}`}
                  type="password"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  className="w-12 h-12 border rounded-lg text-center text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => { setShowPinModal(false); setPin(["", "", "", ""]); setSelectedRequest(null); }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={executeApproval}
                disabled={pin.join("").length < 4}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm disabled:opacity-50"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
