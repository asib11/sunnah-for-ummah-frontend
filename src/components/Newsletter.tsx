
"use client";

import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto bg-[#2d5a42] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        <div className="relative z-10 py-16 px-8 md:px-16 text-center text-white">
          <div className="mb-6">
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-white/60">
              — STAY CONNECTED —
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Join the <span className="italic text-[#d9a34a] font-serif">Sunnah</span> Circle
          </h2>
          
          <p className="max-w-2xl mx-auto text-white/80 text-sm md:text-base mb-10 leading-relaxed font-light">
            Be the first to know about new Panjabi, Thobe and Attar drops, exclusive offers, and Sunnah-inspired stories — straight to your inbox.
          </p>
          
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-10" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full bg-white text-neutral-900 rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[#d9a34a] text-sm"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-[#d9a34a] hover:bg-[#c6923d] text-white font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap text-sm"
            >
              Subscribe
            </button>
          </form>
          
          <div className="pt-4 border-t border-white/10 max-w-xs mx-auto">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
              SUNNAH: THE LEGACY OF THE BEST.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
