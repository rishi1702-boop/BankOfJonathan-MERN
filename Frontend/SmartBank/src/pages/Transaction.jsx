import React from 'react'
import Aisidebar from "../components/Aisidebar"
import Navbar from '../components/Navbar'
import useAuthStore from '../store/useAuthStore'
import { Download } from 'lucide-react'

const Transactionpage = () => {
  const user = useAuthStore(state => state.user);
  const transactions = user?.transactions || [];

  function getDate(transactiondate) {
    const date = new Date(transactiondate);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    let formatted = date.toLocaleString('en-US', options);

    // Add "st", "nd", "rd", "th"
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11 ? 'st' :
      day % 10 === 2 && day !== 12 ? 'nd' :
      day % 10 === 3 && day !== 13 ? 'rd' : 'th';

    formatted = formatted.replace(new RegExp(`\\b${day}\\b`), day + suffix);
    return formatted;
  }

  // Sort descending by date
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDownloadStatement = () => {
    if (sortedTransactions.length === 0) return;

    const headers = ["Date", "Type", "To/From", "Description", "Amount (INR)"];
    
    const csvRows = sortedTransactions.map(t => {
      const formattedDate = new Date(t.date).toLocaleDateString('en-IN');
      const partner = t.otherUserName || "Self";
      const desc = `"${t.description || ""}"`; // handle commas in description
      const amountSign = t.type === 'sent' ? '-' : '+';
      return `${formattedDate},${t.type},${partner},${desc},${amountSign}${Math.abs(t.amount)}`;
    });

    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `statement_${user.firstName}_${new Date().toLocaleDateString('en-IN')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className='flex flex-1 relative overflow-hidden'>
        <Aisidebar />
        <div className='p-6 w-full max-w-7xl mx-auto z-10'>
          
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
            <button 
              onClick={handleDownloadStatement}
              disabled={sortedTransactions.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" /> Statement 
            </button>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 border border-white overflow-x-auto no-scrollbar">
            {sortedTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No transactions found.</p>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-gray-100 uppercase tracking-wider text-sm text-gray-500">
                    <th className="py-4 px-4 font-semibold">To/From</th>
                    <th className="py-4 px-4 font-semibold">Type</th>
                    <th className="py-4 px-4 font-semibold hidden sm:table-cell">Description</th>
                    <th className="py-4 px-4 font-semibold">Date</th>
                    <th className="py-4 px-4 font-semibold text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map(({ _id, amount, date, type, description, otherUserName }) => (
                    <tr
                      key={_id || Math.random()}
                      className="hover:bg-gray-50/50 transition border-b border-gray-50 last:border-0"
                    >
                      <td className="py-4 px-4 align-middle">
                        <span className="font-bold text-gray-800">{otherUserName || "Self"}</span>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${type === 'sent' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {type}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-middle text-gray-500 hidden sm:table-cell truncate max-w-[200px]">{description || "-"}</td>
                      <td className="py-4 px-4 align-middle font-medium text-gray-600">{getDate(date)}</td>
                      <td
                        className={`py-4 px-4 align-middle font-black text-right whitespace-nowrap ${
                          type === "sent" ? "text-gray-900" : "text-emerald-600"
                        }`}
                      >
                        {type === "sent" ? "- " : "+ "}
                        ₹{Math.abs(amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactionpage