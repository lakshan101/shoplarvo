import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Search, ShieldCheck } from 'lucide-react';

const mockCustomers = [
  {
    _id: 'c1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '+94 77 123 4567',
    role: 'customer',
    address: '45 Galle Road, Colombo 03',
    ordersCount: 4,
    totalSpent: 450.00
  },
  {
    _id: 'c2',
    name: 'Marcus Vance',
    email: 'marcus@example.com',
    phone: '+94 71 987 6543',
    role: 'customer',
    address: '12 Kandy Road, Kiribathgoda',
    ordersCount: 2,
    totalSpent: 280.00
  },
  {
    _id: 'c3',
    name: 'David Miller',
    email: 'david@example.com',
    phone: '+94 70 555 1212',
    role: 'customer',
    address: '88 Marine Drive, Bambalapitiya',
    ordersCount: 6,
    totalSpent: 890.00
  }
];

export default function CustomerList() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-200 bg-white space-y-6 shadow-sm text-slate-900">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-900" /> Customer Management Directory (Epic 1)
          </h2>
          <p className="text-xs text-slate-500 mt-1">View registered customer profiles, shipping locations, and order metrics</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 font-bold text-slate-700 uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Primary Address</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <span>{c.name}</span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">{c.role}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                  <span className="block flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {c.email}</span>
                  <span className="block flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {c.phone}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.address}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">{c.ordersCount} orders</span>
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">${c.totalSpent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
