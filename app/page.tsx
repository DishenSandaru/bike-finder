'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Bike {
  id: string;
  name: string;
  brand: string;
  bike_type?: string;
  model_year?: string;
  engine_capacity: number;
  power_hp: number;
  image_url: string;
}

export default function Home() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBikes() {
      const { data, error } = await supabase.from('bikes').select('*');
      if (error) {
        console.error('Error fetching bikes:', error);
      } else {
        setBikes(data || []);
      }
    }
    fetchBikes();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const brands = ['All', ...Array.from(new Set(bikes.map((b) => b.brand).filter(Boolean)))];
  const types = ['All', ...Array.from(new Set(bikes.map((b) => b.bike_type).filter(Boolean)))];

  // Search Suggestions Logic
  const suggestions = bikes.filter(
    (b) =>
      search.trim() !== '' &&
      (b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.brand.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredBikes = bikes.filter((bike) => {
    const matchesSearch =
      bike.name.toLowerCase().includes(search.toLowerCase()) ||
      bike.brand.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || bike.brand === selectedBrand;
    const matchesType = selectedType === 'All' || bike.bike_type === selectedType;

    return matchesSearch && matchesBrand && matchesType;
  });

  return (
    <main className="min-h-screen bg-[#FAFCFB] text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative">
      {/* Background Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-emerald-50/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pb-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/10 border border-slate-800">
              <img
                src="/logo/bikefinderlogo.jpeg"
                alt="BikeFinder Logo"
                className="w-9 h-9 object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none block">
                BIKE<span className="text-emerald-500">FINDER</span>
              </span>
              <p className="text-xs text-slate-400 font-medium mt-1">Explore Motorcycle Specs</p>
            </div>
          </div>
          <Link
            href="/compare"
            className="group relative inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-emerald-500/20"
          >
            <span>Compare Bikes</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </header>

        {/* Floating Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-slate-200/80 mb-10 grid grid-cols-1 md:grid-cols-3 gap-3 relative z-40">
          {/* Search Box + Suggestions Dropdown */}
          <div className="relative" ref={searchRef}>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by bike name or brand..."
                value={search}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full bg-slate-50 border border-slate-200/60 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-xs font-medium outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition duration-200"
              />
            </div>

            {/* Suggestions Overlay */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto mt-2 divide-y divide-slate-100">
                {suggestions.map((b) => (
                  <li
                    key={b.id}
                    onClick={() => {
                      setSearch(b.name);
                      setShowSuggestions(false);
                    }}
                    className="p-3 hover:bg-emerald-50/80 cursor-pointer flex items-center justify-between transition text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-slate-800">{b.name}</span>
                      <span className="text-[10px] text-slate-400">({b.engine_capacity} cc)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shrink-0">
                      <img
                        src={`/logo/${b.brand.toLowerCase().trim()}.png`}
                        alt=""
                        className="h-3 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {b.brand}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Brand Filter Dropdown */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/60 text-slate-800 text-xs font-semibold rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white transition duration-200 cursor-pointer"
          >
            {brands.map((b) => (
              <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
            ))}
          </select>

          {/* Type Filter Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/60 text-slate-800 text-xs font-semibold rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white transition duration-200 cursor-pointer"
          >
            {types.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
            ))}
          </select>
        </div>

        {/* Bike Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 relative z-10">
          {filteredBikes.map((bike) => {
            const brandLogoName = bike.brand ? bike.brand.toLowerCase().trim() : '';

            return (
              <div
                key={bike.id}
                className="group bg-white rounded-3xl border border-slate-200/70 p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:shadow-slate-200/60 hover:border-emerald-500/30 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div>
                  {/* Bike Image Canvas Fix */}
                  <div className="w-full h-52 bg-white rounded-2xl flex items-center justify-center p-4 mb-4 relative overflow-hidden transition-colors duration-300 border border-slate-100/80">
                    <img
                      src={bike.image_url}
                      alt={bike.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    {/* Brand Logo & Name */}
                    <div className="flex items-center gap-1.5">
                      <img
                        src={`/logo/${brandLogoName}.png`}
                        alt={bike.brand}
                        className="h-3.5 object-contain max-w-[40px]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                        {bike.brand}
                      </span>
                    </div>

                    {bike.model_year && (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200/50">
                        {bike.model_year}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-4">
                    {bike.name}
                  </h3>

                  {/* Spec Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Engine</span>
                      <span className="font-black text-slate-800">{bike.engine_capacity} cc</span>
                    </div>
                    <div className="border-l border-slate-200/80 pl-3">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Power</span>
                      <span className="font-black text-slate-800">{bike.power_hp} HP</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/bikes/${bike.id}`}
                  className="w-full text-center bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs py-3 rounded-xl transition-all duration-300 shadow-md group-hover:shadow-emerald-500/20 block"
                >
                  View Full Specifications →
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200/60 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-xs text-slate-500 gap-1 text-center">
          <p>© 2026 BikeFinder. All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium">
            Developed with <span className="text-emerald-500">♥</span> by <span className="font-bold text-slate-800">Dishen</span>
          </p>
        </div>
      </footer>
    </main>
  );
}