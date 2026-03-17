import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Coins } from "lucide-react";
import SendMoney from "../components/Contacts";
import QuickContacts from "../components/QuickContacts";
import Transaction from "../components/Transaction";
import Navbar from "../components/Navbar";
import ExpenseChart from "../components/Charts";
import IncomingRequests from "../components/IncomingRequests";
import { useNavigate } from 'react-router-dom';
import Goals from "../components/Goals";
import useAuthStore from "../store/useAuthStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const checkAuth = useAuthStore(state => state.checkAuth);
  
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { fromAI: true, text: "Hi! Ask me anything about your transactions or finances." },
  ]);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Fetch all users for contacts using React Query
  const { data: existingUsers = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await api.get('/auth/getUsers');
      return res.data.Users;
    }
  });

  // Ask AI Mutation
  const aiMutation = useMutation({
    mutationFn: async (prompt) => {
      const res = await api.post('/ai/getTransaction', { prompt });
      return res.data.success || "AI did not return a response.";
    },
    onSuccess: (reply) => {
      setChatMessages(prev => [...prev, { fromAI: true, text: reply }]);
    },
    onError: () => {
      setChatMessages(prev => [...prev, { fromAI: true, text: "Sorry, AI could not process your request." }]);
    }
  });

  // Handle user sending message
  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    // Show user message immediately
    setChatMessages(prev => [...prev, { fromAI: false, text: trimmed }]);
    setChatInput("");

    // Trigger AI Mutation
    aiMutation.mutate(trimmed);
  };

  const reload = () => {
    location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-col md:flex-row flex-grow p-4 md:p-6 gap-4 md:gap-6 w-full max-w-7xl mx-auto">
        {/* Left Panel */}
        <section className="flex flex-col flex-grow w-full md:w-1/3 space-y-4 md:space-y-6">
          {/* Balance Card */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200 flex items-center justify-between">
            <div className="flex-col">
              <h2 className="text-base md:text-lg font-semibold mb-2 text-gray-800">Current Balance</h2>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                ₹{user?.balance?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <Coins size={60} className="text-blue-500" />
            </div>
          </div>

          {/* Incoming Requests */}
          <IncomingRequests />

          {/* Quick Contacts */}
          <QuickContacts currentUser={user} Users={existingUsers} />

          {/* Send/Request Money */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Send className="w-5 h-5 text-blue-600" /> Transfer Money
            </h2>
            <SendMoney currentUser={user} contacts={existingUsers} refreshUser={checkAuth} reload={reload} />
          </div>
        </section>

        {/* Right Panel */}
        <section className="flex flex-col flex-grow w-full md:w-2/3 space-y-4 md:space-y-6">
          {/* Chatbot */}
          <div className="flex flex-col bg-white rounded-xl shadow-md p-4 md:p-6 h-[400px] md:h-[450px] border border-gray-200">
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Ask BankOfJonathan AI
            </h2>
            <div className="flex-grow overflow-y-auto border rounded-xl p-3 md:p-4 mb-4 space-y-3 bg-gray-50">
              {chatMessages.map(({ fromAI, text }, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    fromAI
                      ? "bg-white border text-gray-800 self-start shadow-sm"
                      : "bg-blue-600 text-white self-end shadow-sm"
                  } ${!fromAI && "ml-auto"}`}
                >
                  {text}
                </div>
              ))}
              {aiMutation.isPending && (
                <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-white border text-gray-500 self-start shadow-sm flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2 md:gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me about your transactions..."
                className="w-20 flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={aiMutation.isPending}
              />
              <button
                onClick={handleSendMessage}
                disabled={aiMutation.isPending || !chatInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 md:px-6 font-semibold transition flex items-center gap-2"
              >
                {aiMutation.isPending ? "Asking..." : "Send"} <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Charts and other panels */}
          <ExpenseChart />
          <div className="flex gap-6 sm:flex-row flex-col">
            <div onClick={() => navigate("/dashboard/transaction")} className="cursor-pointer flex-grow">
              <Transaction currentUser={user} />
            </div>
            <div onClick={() => navigate("/dashboard/goals")} className="cursor-pointer flex-grow">
              <Goals />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
