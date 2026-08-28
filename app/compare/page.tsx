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
  cooling_system?: string;
  power_hp: number;
  torque_nm: number;
  top_speed_kmph: number;
  transmission?: string;
  clutch_type?: string;
  valves_per_cylinder?: string;
  muffler?: string;
  frame?: string;
  front_suspension?: string;
  rear_suspension?: string;
  front_brake?: string;
  rear_brake?: string;
  tyre_front?: string;
  tyre_rear?: string;
  abs?: string;
  battery?: string;
  headlamp?: string;
  tail_lamp?: string;
  turn_signal_lamp?: string;
  cluster?: string;
  traction_control?: string;
  bluetooth_connectivity?: string;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  saddle_height_mm?: number;
  wheelbase_mm?: number;
  ground_clearance_mm?: number;
  kerb_weight_kg?: number;
  fuel_tank_capacity_l?: number;
  fuel_consumption_kmpl?: string | number;
  image_url: string;
}

export default function ComparePage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [bike1Id, setBike1Id] = useState<string>('');
  const [bike2Id, setBike2Id] = useState<string>('');

  // Search input values
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');

  // Dropdown suggestions visibility
  const [showSuggest1, setShowSuggest1] = useState(false);
  const [showSuggest2, setShowSuggest2] = useState(false);

  // Refs for click outside
  const suggestRef1 = useRef<HTMLDivElement>(null);
  const suggestRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBikes() {
      const { data, error } = await supabase.from('bikes').select('*');
      if (data && data.length > 0) {
        setBikes(data);
        setBike1Id(data[0].id);
        if (data.length > 1) {
          setBike2Id(data[1].id);
        }
      }
    }
    fetchBikes();
  }, []);

  // Handle outside clicks to close suggestion lists
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestRef1.current && !suggestRef1.current.contains(event.target as Node)) {
        setShowSuggest1(false);
      }
      if (suggestRef2.current && !suggestRef2.current.contains(event.target as Node)) {
        setShowSuggest2(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const bike1 = bikes.find((b) => b.id === bike1Id);
  const bike2 = bikes.find((b) => b.id === bike2Id);

  // Filter bikes based on search queries
  const suggestions1 = bikes.filter(
    (b) =>
      searchQuery1.trim() !== '' &&
      (b.name.toLowerCase().includes(searchQuery1.toLowerCase()) ||
        b.brand.toLowerCase().includes(searchQuery1.toLowerCase()))
  );

  const suggestions2 = bikes.filter(
    (b) =>
      searchQuery2.trim() !== '' &&
      (b.name.toLowerCase().includes(searchQuery2.toLowerCase()) ||
        b.brand.toLowerCase().includes(searchQuery2.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-[#F4F9F6] text-slate-800 font-sans flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
        
        {/* Navigation Header with Added Logo */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 font-bold transition">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <img
              src="/logo/bikefinderlogo.jpeg"
              alt="BikeFinder Logo"
              className="w-14 h-14 object-cover rounded-lg shadow-sm border border-slate-100"
            />
            <span className="text-xl font-extrabold text-slate-900">
              BIKE<span className="text-emerald-500">FINDER</span>
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-10">
          <span className="bg-emerald-500/10 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
            SIDE-BY-SIDE COMPARISON
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-2">
            Compare Motorbikes Specs
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
            Select any two motorbikes to compare performance, dimensions, and technical specifications in detail.
          </p>
        </div>

        {/* Bike Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* First Bike Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select First Bike
            </label>

            {/* Search Input Box with 🔍 Icon + Dropdown Suggestions */}
            <div className="relative mb-3" ref={suggestRef1}>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search bike by name or brand..."
                  value={searchQuery1}
                  onChange={(e) => {
                    setSearchQuery1(e.target.value);
                    setShowSuggest1(true);
                  }}
                  onFocus={() => setShowSuggest1(true)}
                  className="w-full bg-[#F8FAF9] border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-8 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {showSuggest1 && suggestions1.length > 0 && (
                <ul className="absolute z-20 top-full left-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl max-h-52 overflow-y-auto mt-1 divide-y divide-slate-50">
                  {suggestions1.map((b) => (
                    <li
                      key={b.id}
                      onClick={() => {
                        setBike1Id(b.id);
                        setSearchQuery1('');
                        setShowSuggest1(false);
                      }}
                      className="p-2.5 hover:bg-emerald-50 cursor-pointer flex justify-between items-center transition text-xs"
                    >
                      <span className="font-semibold text-slate-800">{b.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
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

            {/* Original Select Box (Retained) */}
            <select
              value={bike1Id}
              onChange={(e) => setBike1Id(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-slate-200 text-slate-900 rounded-xl p-3 font-semibold focus:outline-none focus:border-emerald-500 transition mb-6 text-sm"
            >
              {bikes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.brand})
                </option>
              ))}
            </select>

            {bike1 && (
              <div className="text-center">
                <div className="w-full h-48 bg-[#F8FAF9] rounded-xl flex items-center justify-center p-4 mb-4 border border-slate-100 relative overflow-hidden">
                  <img 
                    src={bike1.image_url} 
                    alt={bike1.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply" 
                  />
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <img
                    src={`/logo/${bike1.brand.toLowerCase().trim()}.png`}
                    alt={bike1.brand}
                    className="h-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    {bike1.brand}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">{bike1.name}</h2>
              </div>
            )}
          </div>

          {/* Second Bike Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Second Bike
            </label>

            {/* Search Input Box with 🔍 Icon + Dropdown Suggestions */}
            <div className="relative mb-3" ref={suggestRef2}>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search bike by name or brand..."
                  value={searchQuery2}
                  onChange={(e) => {
                    setSearchQuery2(e.target.value);
                    setShowSuggest2(true);
                  }}
                  onFocus={() => setShowSuggest2(true)}
                  className="w-full bg-[#F8FAF9] border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-8 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {showSuggest2 && suggestions2.length > 0 && (
                <ul className="absolute z-20 top-full left-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl max-h-52 overflow-y-auto mt-1 divide-y divide-slate-50">
                  {suggestions2.map((b) => (
                    <li
                      key={b.id}
                      onClick={() => {
                        setBike2Id(b.id);
                        setSearchQuery2('');
                        setShowSuggest2(false);
                      }}
                      className="p-2.5 hover:bg-emerald-50 cursor-pointer flex justify-between items-center transition text-xs"
                    >
                      <span className="font-semibold text-slate-800">{b.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
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

            {/* Original Select Box (Retained) */}
            <select
              value={bike2Id}
              onChange={(e) => setBike2Id(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-slate-200 text-slate-900 rounded-xl p-3 font-semibold focus:outline-none focus:border-emerald-500 transition mb-6 text-sm"
            >
              {bikes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.brand})
                </option>
              ))}
            </select>

            {bike2 && (
              <div className="text-center">
                <div className="w-full h-48 bg-[#F8FAF9] rounded-xl flex items-center justify-center p-4 mb-4 border border-slate-100 relative overflow-hidden">
                  <img 
                    src={bike2.image_url} 
                    alt={bike2.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply" 
                  />
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <img
                    src={`/logo/${bike2.brand.toLowerCase().trim()}.png`}
                    alt={bike2.brand}
                    className="h-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    {bike2.brand}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">{bike2.name}</h2>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Comparison Table */}
        {bike1 && bike2 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-16">
            <div className="bg-emerald-500 text-white font-bold px-6 py-4 text-center tracking-wider text-sm">
              DETAILED TECHNICAL COMPARISON
            </div>

            <div className="divide-y divide-slate-100">
              <RowSection title="General Information" />
              <SpecRow 
                label="Brand" 
                val1={bike1.brand} 
                val2={bike2.brand} 
                brand1={bike1.brand} 
                brand2={bike2.brand} 
              />
              <SpecRow label="Category" val1={bike1.bike_type} val2={bike2.bike_type} />
              <SpecRow label="Model Production" val1={bike1.model_year} val2={bike2.model_year} />

              <RowSection title="Engine & Transmission" />
              <SpecRow label="Displacement" val1={`${bike1.engine_capacity} cc`} val2={`${bike2.engine_capacity} cc`} />
              <SpecRow label="Engine Type / Cooling" val1={bike1.cooling_system} val2={bike2.cooling_system} />
              <SpecRow label="Max Power" val1={`${bike1.power_hp} HP`} val2={`${bike2.power_hp} HP`} />
              <SpecRow label="Max Torque" val1={`${bike1.torque_nm} Nm`} val2={`${bike2.torque_nm} Nm`} />
              <SpecRow label="Top Speed" val1={`${bike1.top_speed_kmph} km/h`} val2={`${bike2.top_speed_kmph} km/h`} />
              <SpecRow label="Transmission" val1={bike1.transmission} val2={bike2.transmission} />

              <RowSection title="Brakes, Tyres & Frame" />
              <SpecRow label="Front Brake" val1={bike1.front_brake} val2={bike2.front_brake} />
              <SpecRow label="Rear Brake" val1={bike1.rear_brake} val2={bike2.rear_brake} />
              <SpecRow label="Front Suspension" val1={bike1.front_suspension} val2={bike2.front_suspension} />
              <SpecRow label="Rear Suspension" val1={bike1.rear_suspension} val2={bike2.rear_suspension} />
              <SpecRow label="Front Tyre" val1={bike1.tyre_front} val2={bike2.tyre_front} />
              <SpecRow label="Rear Tyre" val1={bike1.tyre_rear} val2={bike2.tyre_rear} />
              <SpecRow label="Frame Structure" val1={bike1.frame} val2={bike2.frame} />

              <RowSection title="Dimensions & Weight" />
              <SpecRow label="Kerb Weight" val1={bike1.kerb_weight_kg ? `${bike1.kerb_weight_kg} kg` : '-'} val2={bike2.kerb_weight_kg ? `${bike2.kerb_weight_kg} kg` : '-'} />
              <SpecRow label="Fuel Tank Capacity" val1={bike1.fuel_tank_capacity_l ? `${bike1.fuel_tank_capacity_l} Litres` : '-'} val2={bike2.fuel_tank_capacity_l ? `${bike2.fuel_tank_capacity_l} Litres` : '-'} />
              <SpecRow label="Fuel Economy (Approx.)" val1={bike1.fuel_consumption_kmpl ? `${bike1.fuel_consumption_kmpl} km/L` : '-'} val2={bike2.fuel_consumption_kmpl ? `${bike2.fuel_consumption_kmpl} km/L` : '-'} />
              <SpecRow label="Ground Clearance" val1={bike1.ground_clearance_mm ? `${bike1.ground_clearance_mm} mm` : '-'} val2={bike2.ground_clearance_mm ? `${bike2.ground_clearance_mm} mm` : '-'} />
              <SpecRow label="Seat Height" val1={bike1.saddle_height_mm ? `${bike1.saddle_height_mm} mm` : '-'} val2={bike2.saddle_height_mm ? `${bike2.saddle_height_mm} mm` : '-'} />

              <RowSection title="Electricals & Features" />
              <SpecRow label="Instrument Cluster" val1={bike1.cluster} val2={bike2.cluster} />
              <SpecRow label="Headlamp" val1={bike1.headlamp} val2={bike2.headlamp} />
              <SpecRow label="Bluetooth Connectivity" val1={bike1.bluetooth_connectivity} val2={bike2.bluetooth_connectivity} />
            </div>
          </div>
        )}
      </div>

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

function RowSection({ title }: { title: string }) {
  return (
    <div className="bg-slate-50 px-6 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest border-y border-slate-100">
      {title}
    </div>
  );
}

function SpecRow({
  label,
  val1,
  val2,
  brand1,
  brand2,
}: {
  label: string;
  val1?: string | number;
  val2?: string | number;
  brand1?: string;
  brand2?: string;
}) {
  return (
    <div className="grid grid-cols-3 px-6 py-3.5 text-sm hover:bg-slate-50/50">
      <div className="text-slate-500 font-medium">{label}</div>
      <div className="text-slate-900 pr-4 flex items-center gap-2">
        {brand1 && (
          <img
            src={`/logo/${brand1.toLowerCase().trim()}.png`}
            alt=""
            className="h-4 object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}
        <span>{val1 || '-'}</span>
      </div>
      <div className="text-slate-900 border-l border-slate-100 pl-4 flex items-center gap-2">
        {brand2 && (
          <img
            src={`/logo/${brand2.toLowerCase().trim()}.png`}
            alt=""
            className="h-4 object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}
        <span>{val2 || '-'}</span>
      </div>
    </div>
  );
}