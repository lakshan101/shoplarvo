import React from 'react';
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AdminAnalytics({ stats }) {
  const data = stats || {
    totalSales: 54890.00,
    totalOrders: 142,
    totalCustomers: 98,
    lowStockProducts: 3
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Revenue</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">${data.totalSales.toLocaleString()}</div>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% growth this month
          </span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{data.totalOrders}</div>
          <span className="text-[11px] font-bold text-slate-500">100% processed cleanly</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Customers</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{data.totalCustomers}</div>
          <span className="text-[11px] font-bold text-emerald-600">+12 new registrations</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Low Stock Items</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{data.lowStockProducts}</div>
          <span className="text-[11px] font-bold text-amber-700">Requires reordering</span>
        </div>

      </div>

      {/* Visual Sales Chart Simulation */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
          Weekly Revenue & Sales Performance
        </h3>
        <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-200 pb-2">
          {[
            { day: 'Mon', val: 65 },
            { day: 'Tue', val: 80 },
            { day: 'Wed', val: 45 },
            { day: 'Thu', val: 95 },
            { day: 'Fri', val: 120 },
            { day: 'Sat', val: 140 },
            { day: 'Sun', val: 110 }
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center flex-1 space-y-2">
              <div 
                className="w-full bg-slate-900 rounded-t-xl transition-all duration-500 hover:bg-blue-600"
                style={{ height: `${bar.val}%` }}
              ></div>
              <span className="text-[10px] font-bold text-slate-500">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
