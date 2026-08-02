import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 text-slate-300 text-sm py-12 mt-20 w-full">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#38bdf8]" />
            <span className="text-xl font-bold text-white">StyleHub</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Smart Clothing Shop Management System & Executive AI Fashion E-Commerce Platform.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Shop Epics</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="/shop" className="hover:text-white transition-colors">Streetwear Collection</a></li>
            <li><a href="/shop" className="hover:text-white transition-colors">Formal & Suits</a></li>
            <li><a href="/shop" className="hover:text-white transition-colors">Casual Apparel</a></li>
            <li><a href="/shop" className="hover:text-white transition-colors">AI Recommendations</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Customer Services</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="/profile" className="hover:text-white transition-colors">Customer Account</a></li>
            <li><a href="/profile" className="hover:text-white transition-colors">Order History</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact Support</a></li>
            <li><a href="/about" className="hover:text-white transition-colors">About StyleHub</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Security & Compliance</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            JWT Token Security, MongoDB Atlas Database, Full Screen Executive Design.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-sky-400 text-xs font-bold border border-slate-700">
            System Operational 100%
          </div>
        </div>

      </div>

      <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 StyleHub Inc. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> for Smart Clothing Shop Management.
        </p>
      </div>
    </footer>
  );
}
