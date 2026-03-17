import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAuthStore from "../store/useAuthStore";

export default function ExpenseChart() {
  const user = useAuthStore(state => state.user);

  const chartData = useMemo(() => {
    if (!user?.transactions || user.transactions.length === 0) return [];
    
    // We want to visualize expenses (sent money) over time
    const expenses = user.transactions.filter(t => t.type === 'sent');
    
    // Group by short date string like "10 Jan"
    const grouped = expenses.reduce((acc, curr) => {
      const date = new Date(curr.date);
      const dayStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      if (!acc[dayStr]) {
         acc[dayStr] = 0;
      }
      acc[dayStr] += Math.abs(curr.amount);
      return acc;
    }, {});
    
    // Map to array and sort by actual chronological order
    // But since the grouped keys are string representations, we sort based on the original dates
    // To do this properly, let's restructure the grouping
    
    const chronological = [...expenses].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    const finalData = [];
    chronological.forEach(t => {
       const date = new Date(t.date);
       const dayStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
       
       const existing = finalData.find(item => item.date === dayStr);
       if (existing) {
         existing.amount += Math.abs(t.amount);
       } else {
         finalData.push({ date: dayStr, amount: Math.abs(t.amount) });
       }
    });

    return finalData.slice(-14); // Return last 14 days of activity
  }, [user]);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200"> 
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Expense Trend (Last 14 Active Days)
      </h2>

      <div className="flex-1 w-full min-h-[300px]">
        {chartData.length === 0 ? (
           <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium">
             No expense data available to visualize.
           </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(val) => `₹${val}`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`₹${value}`, "Spent"]}
                labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4F46E5"
                strokeWidth={4}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
