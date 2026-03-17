import React, { useState } from 'react'
import api from '../services/api'; // using the centralized api instance for credentials

function SendMoney({ currentUser, contacts, refreshUser }) {
  const [activeTab, setActiveTab] = useState('send'); // 'send' or 'request'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handlePinChange = (value, index) => {
    if (value.length > 1) return; // allow only single digit
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // auto-focus next input
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const handleSubmitClick = () => {
    if (!amount || +amount <= 0 || !selectedContact) {
      alert("Please select a contact and enter a valid amount");
      return;
    }
    
    if (activeTab === 'send') {
      setShowPinModal(true);
    } else {
      executeTransaction();
    }
  };

  const executeTransaction = async () => {
    setLoading(true);
    try {
      const payload = {
        receiverid: selectedContact._id,
        amount: +amount,
        description
      };
      
      if (activeTab === 'send') {
        payload.pin = pin.join("");
        await api.post('/payment/send', payload);
      } else {
        await api.post('/payment/request', payload);
      }
      
      refreshUser();
      
      // Reset form
      setAmount("");
      setDescription("");
      setSelectedContact(null);
      setPhoneNumber("");
      setPin(["", "", "", ""]);
      setShowPinModal(false);
      
    } catch (error) {
      alert(error.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-lg">
        <button 
          onClick={() => setActiveTab('send')}
          className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'send' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Send
        </button>
        <button 
           onClick={() => setActiveTab('request')}
           className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'request' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
           Request
        </button>
      </div>

      <label className="font-semibold text-gray-700 text-sm">Search Person</label>
      <input
        type="Number"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      
      {phoneNumber.length > 0 && !selectedContact && (
        <div className="max-h-32 overflow-y-auto space-y-1">
          {contacts
            .filter((user) => user.phone !== currentUser.phone && user.phone.startsWith(phoneNumber))
            .map((item) => (
              <div 
                key={item._id} 
                className="border border-blue-200 bg-blue-50 text-blue-800 rounded p-2 text-sm cursor-pointer hover:bg-blue-100 transition" 
                onClick={() => { setSelectedContact(item); setPhoneNumber(item.phone); }}
              >
                {item.firstName} {item.lastName}
              </div>
            ))}
        </div>
      )}

      {selectedContact && (
        <>
          <label className="font-semibold text-gray-700 text-sm">{activeTab === 'send' ? 'Send to:' : 'Request from:'} </label>
          <div className="border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 font-medium text-gray-800 flex justify-between items-center">
            {selectedContact.firstName} {selectedContact.lastName}
            <button onClick={() => {setSelectedContact(null); setPhoneNumber("");}} className="text-red-500 text-xs hover:underline">Clear</button>
          </div>
          
          <label className="font-semibold text-gray-700 text-sm">Description: </label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="What's it for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      )}
     
      <label className="font-semibold text-gray-700 text-sm">Amount (₹)</label>
      <input
        type="number"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleSubmitClick}
        disabled={loading}
        className={`font-semibold py-2.5 rounded-lg transition text-white ${activeTab === 'send' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} disabled:opacity-50`}
      >
        {loading ? 'Processing...' : activeTab === 'send' ? 'Send Money' : 'Request Money'}
      </button>

      {/* Pin Modal for Send Flow */}
      {showPinModal && activeTab === 'send' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">Enter Your PIN</h2>
            <div className="flex justify-center gap-3 mb-6">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  className="w-12 h-12 border rounded-lg text-center text-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowPinModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  executeTransaction();
                }}
                disabled={pin.join("").length < 4}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm disabled:opacity-50"
              >
                Confirm PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SendMoney;