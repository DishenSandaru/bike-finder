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

  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');

  const [showSuggest1, setShowSuggest1] = useState(false);
  const [showSuggest2, setShowSuggest2] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const suggestRef1 = useRef<HTMLDivElement>(null);
  const suggestRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBikes() {
      const { data, error } = await supabase
        .from('bikes')
        .select('*');

      if (error) {
        console.error('Error fetching bikes:', error);
      }

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestRef1.current &&
        !suggestRef1.current.contains(event.target as Node)
      ) {
        setShowSuggest1(false);
      }

      if (
        suggestRef2.current &&
        !suggestRef2.current.contains(event.target as Node)
      ) {
        setShowSuggest2(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const bike1 = bikes.find((b) => b.id === bike1Id);
  const bike2 = bikes.find((b) => b.id === bike2Id);

  const suggestions1 = bikes
    .filter(
      (b) =>
        searchQuery1.trim() !== '' &&
        (b.name
          .toLowerCase()
          .includes(searchQuery1.toLowerCase()) ||
          b.brand
            .toLowerCase()
            .includes(searchQuery1.toLowerCase()))
    )
    .slice(0, 8);

  const suggestions2 = bikes
    .filter(
      (b) =>
        searchQuery2.trim() !== '' &&
        (b.name
          .toLowerCase()
          .includes(searchQuery2.toLowerCase()) ||
          b.brand
            .toLowerCase()
            .includes(searchQuery2.toLowerCase()))
    )
    .slice(0, 8);

  const scrollToComparison = () => {
    document
      .getElementById('comparison-table')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900 overflow-x-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-400/10 blur-[130px] rounded-full" />

        <div className="absolute top-[30%] -left-48 w-[500px] h-[500px] bg-cyan-400/5 blur-[120px] rounded-full" />

        <div className="absolute bottom-0 -right-48 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full group-hover:bg-emerald-500/50 transition" />

                <div className="relative w-12 h-12 rounded-2xl bg-slate-950 p-1 border border-slate-800 shadow-xl overflow-hidden">
                  <img
                    src="/logo/bikefinderlogo.jpeg"
                    alt="BikeFinder Logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 leading-none">
                  BIKE
                  <span className="text-emerald-500">
                    FINDER
                  </span>
                </h1>

                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wide mt-1">
                  DISCOVER. COMPARE. RIDE.
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
              >
                Explore Bikes
              </Link>

              <Link
                href="/"
                className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
              >
                Categories
              </Link>

              <button
                onClick={scrollToComparison}
                className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
              >
                Compare Specs
              </button>
            </nav>

            {/* DESKTOP ACTION */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 bg-slate-950 hover:bg-emerald-600 text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Back to Home
                <span className="group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
              </Link>
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="lg:hidden w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-5 flex flex-col gap-3 border-t border-slate-100 pt-5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left font-semibold text-slate-600"
              >
                Explore Bikes
              </Link>

              <button
                onClick={() => {
                  scrollToComparison();
                  setMobileMenuOpen(false);
                }}
                className="text-left font-semibold text-slate-600"
              >
                Compare Specs
              </button>

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-slate-950 text-white py-3 px-5 rounded-xl font-bold text-center"
              >
                Back to Home ←
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-16 sm:pt-20 pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-2 mb-7">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />

              <span className="text-xs font-bold text-slate-600">
                SIDE-BY-SIDE MOTORCYCLE COMPARISON
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-950">
              Compare Bikes.
              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-500">
                Find Your Perfect Ride.
              </span>
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-base sm:text-lg text-slate-500 leading-8">
              Select any two motorcycles and compare performance,
              dimensions, features and technical specifications
              side by side.
            </p>
          </div>
        </div>
      </section>

      {/* BIKE SELECTORS */}
      <section className="relative pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* BACKGROUND GLOW */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 blur-3xl rounded-[3rem]" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* FIRST BIKE */}
              <div className="group relative bg-white border border-slate-200 rounded-[2rem] p-5 sm:p-7 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 rounded-t-[2rem]" />

                {/* CARD HEADER */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
                      First Motorcycle
                    </p>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">
                      Choose Bike One
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg">
                    🏍️
                  </div>
                </div>

                {/* SEARCH */}
                <div
                  className="relative mb-4"
                  ref={suggestRef1}
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">
                      🔍
                    </span>

                    <input
                      type="text"
                      placeholder="Search motorcycle or brand..."
                      value={searchQuery1}
                      onChange={(e) => {
                        setSearchQuery1(e.target.value);
                        setShowSuggest1(true);
                      }}
                      onFocus={() => setShowSuggest1(true)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                    />
                  </div>

                  {showSuggest1 &&
                    suggestions1.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-40">
                        {suggestions1.map((b) => (
                          <button
                            type="button"
                            key={b.id}
                            onClick={() => {
                              setBike1Id(b.id);
                              setSearchQuery1('');
                              setShowSuggest1(false);
                            }}
                            className="w-full flex items-center justify-between gap-4 p-4 hover:bg-emerald-50 text-left transition border-b border-slate-100 last:border-0"
                          >
                            <div>
                              <p className="font-bold text-sm text-slate-900">
                                {b.name}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                {b.brand} • {b.engine_capacity} cc
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <img
                                src={`/logo/${b.brand
                                  .toLowerCase()
                                  .trim()}.png`}
                                alt=""
                                className="h-5 max-w-[42px] object-contain"
                                onError={(e) => {
                                  (
                                    e.target as HTMLImageElement
                                  ).style.display = 'none';
                                }}
                              />

                              <span className="text-emerald-600">
                                →
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                {/* SELECT BOX */}
                <div className="relative mb-6">
                  <select
                    value={bike1Id}
                    onChange={(e) =>
                      setBike1Id(e.target.value)
                    }
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none cursor-pointer focus:bg-white focus:border-emerald-500 transition"
                  >
                    {bikes.map((b) => (
                      <option
                        key={b.id}
                        value={b.id}
                      >
                        {b.name} ({b.brand})
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ↓
                  </span>
                </div>

                {/* BIKE DISPLAY */}
                {bike1 && (
                  <div>
                    <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-3xl overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.10),_transparent_65%)]" />

                      <img
                        src={bike1.image_url}
                        alt={bike1.name}
                        className="relative z-10 max-w-[88%] max-h-[82%] object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
                      />
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2">
                      <div className="h-8 min-w-8 max-w-[52px] px-1 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                        <img
                          src={`/logo/${bike1.brand
                            .toLowerCase()
                            .trim()}.png`}
                          alt={bike1.brand}
                          className="max-h-5 max-w-[45px] object-contain"
                          onError={(e) => {
                            (
                              e.target as HTMLImageElement
                            ).style.display = 'none';
                          }}
                        />
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">
                        {bike1.brand}
                      </span>
                    </div>

                    <h2 className="text-center text-2xl sm:text-3xl font-black text-slate-950 mt-3">
                      {bike1.name}
                    </h2>
                  </div>
                )}
              </div>

              {/* SECOND BIKE */}
              <div className="group relative bg-white border border-slate-200 rounded-[2rem] p-5 sm:p-7 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-500 to-emerald-400 rounded-t-[2rem]" />

                {/* CARD HEADER */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
                      Second Motorcycle
                    </p>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">
                      Choose Bike Two
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-lg">
                    ⚡
                  </div>
                </div>

                {/* SEARCH */}
                <div
                  className="relative mb-4"
                  ref={suggestRef2}
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">
                      🔍
                    </span>

                    <input
                      type="text"
                      placeholder="Search motorcycle or brand..."
                      value={searchQuery2}
                      onChange={(e) => {
                        setSearchQuery2(e.target.value);
                        setShowSuggest2(true);
                      }}
                      onFocus={() => setShowSuggest2(true)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                    />
                  </div>

                  {showSuggest2 &&
                    suggestions2.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-40">
                        {suggestions2.map((b) => (
                          <button
                            type="button"
                            key={b.id}
                            onClick={() => {
                              setBike2Id(b.id);
                              setSearchQuery2('');
                              setShowSuggest2(false);
                            }}
                            className="w-full flex items-center justify-between gap-4 p-4 hover:bg-emerald-50 text-left transition border-b border-slate-100 last:border-0"
                          >
                            <div>
                              <p className="font-bold text-sm text-slate-900">
                                {b.name}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                {b.brand} • {b.engine_capacity} cc
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <img
                                src={`/logo/${b.brand
                                  .toLowerCase()
                                  .trim()}.png`}
                                alt=""
                                className="h-5 max-w-[42px] object-contain"
                                onError={(e) => {
                                  (
                                    e.target as HTMLImageElement
                                  ).style.display = 'none';
                                }}
                              />

                              <span className="text-emerald-600">
                                →
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                {/* SELECT BOX */}
                <div className="relative mb-6">
                  <select
                    value={bike2Id}
                    onChange={(e) =>
                      setBike2Id(e.target.value)
                    }
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none cursor-pointer focus:bg-white focus:border-emerald-500 transition"
                  >
                    {bikes.map((b) => (
                      <option
                        key={b.id}
                        value={b.id}
                      >
                        {b.name} ({b.brand})
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ↓
                  </span>
                </div>

                {/* BIKE DISPLAY */}
                {bike2 && (
                  <div>
                    <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-3xl overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.08),_transparent_65%)]" />

                      <img
                        src={bike2.image_url}
                        alt={bike2.name}
                        className="relative z-10 max-w-[88%] max-h-[82%] object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
                      />
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2">
                      <div className="h-8 min-w-8 max-w-[52px] px-1 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                        <img
                          src={`/logo/${bike2.brand
                            .toLowerCase()
                            .trim()}.png`}
                          alt={bike2.brand}
                          className="max-h-5 max-w-[45px] object-contain"
                          onError={(e) => {
                            (
                              e.target as HTMLImageElement
                            ).style.display = 'none';
                          }}
                        />
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">
                        {bike2.brand}
                      </span>
                    </div>

                    <h2 className="text-center text-2xl sm:text-3xl font-black text-slate-950 mt-3">
                      {bike2.name}
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      {bike1 && bike2 && (
        <section
          id="comparison-table"
          className="py-16 sm:py-24 bg-white/60 border-y border-slate-200/70 scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* SECTION TITLE */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
                Detailed Analysis
              </span>

              <h2 className="text-4xl sm:text-5xl font-black text-slate-950 mt-3">
                Technical Comparison
              </h2>

              <p className="text-slate-500 mt-4">
                Compare every important specification between your
                selected motorcycles.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 blur-3xl rounded-[3rem]" />

              <div className="relative bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                {/* TABLE HEADER */}
                <div className="bg-slate-950 px-4 sm:px-8 py-6 sm:py-7">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <div className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">
                      Specification
                    </div>

                    <div className="text-center">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-emerald-400">
                        Motorcycle One
                      </p>

                      <p className="text-sm sm:text-lg font-black text-white mt-1 truncate">
                        {bike1.name}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-cyan-400">
                        Motorcycle Two
                      </p>

                      <p className="text-sm sm:text-lg font-black text-white mt-1 truncate">
                        {bike2.name}
                      </p>
                    </div>
                  </div>
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

                  <SpecRow
                    label="Category"
                    val1={bike1.bike_type}
                    val2={bike2.bike_type}
                  />

                  <SpecRow
                    label="Model Production"
                    val1={bike1.model_year}
                    val2={bike2.model_year}
                  />

                  <RowSection title="Engine & Transmission" />

                  <SpecRow
                    label="Displacement"
                    val1={`${bike1.engine_capacity} cc`}
                    val2={`${bike2.engine_capacity} cc`}
                  />

                  <SpecRow
                    label="Engine Type / Cooling"
                    val1={bike1.cooling_system}
                    val2={bike2.cooling_system}
                  />

                  <SpecRow
                    label="Max Power"
                    val1={`${bike1.power_hp} HP`}
                    val2={`${bike2.power_hp} HP`}
                  />

                  <SpecRow
                    label="Max Torque"
                    val1={`${bike1.torque_nm} Nm`}
                    val2={`${bike2.torque_nm} Nm`}
                  />

                  <SpecRow
                    label="Top Speed"
                    val1={`${bike1.top_speed_kmph} km/h`}
                    val2={`${bike2.top_speed_kmph} km/h`}
                  />

                  <SpecRow
                    label="Transmission"
                    val1={bike1.transmission}
                    val2={bike2.transmission}
                  />

                  <RowSection title="Brakes, Tyres & Frame" />

                  <SpecRow
                    label="Front Brake"
                    val1={bike1.front_brake}
                    val2={bike2.front_brake}
                  />

                  <SpecRow
                    label="Rear Brake"
                    val1={bike1.rear_brake}
                    val2={bike2.rear_brake}
                  />

                  <SpecRow
                    label="Front Suspension"
                    val1={bike1.front_suspension}
                    val2={bike2.front_suspension}
                  />

                  <SpecRow
                    label="Rear Suspension"
                    val1={bike1.rear_suspension}
                    val2={bike2.rear_suspension}
                  />

                  <SpecRow
                    label="Front Tyre"
                    val1={bike1.tyre_front}
                    val2={bike2.tyre_front}
                  />

                  <SpecRow
                    label="Rear Tyre"
                    val1={bike1.tyre_rear}
                    val2={bike2.tyre_rear}
                  />

                  <SpecRow
                    label="Frame Structure"
                    val1={bike1.frame}
                    val2={bike2.frame}
                  />

                  <RowSection title="Dimensions & Weight" />

                  <SpecRow
                    label="Kerb Weight"
                    val1={
                      bike1.kerb_weight_kg
                        ? `${bike1.kerb_weight_kg} kg`
                        : '-'
                    }
                    val2={
                      bike2.kerb_weight_kg
                        ? `${bike2.kerb_weight_kg} kg`
                        : '-'
                    }
                  />

                  <SpecRow
                    label="Fuel Tank Capacity"
                    val1={
                      bike1.fuel_tank_capacity_l
                        ? `${bike1.fuel_tank_capacity_l} Litres`
                        : '-'
                    }
                    val2={
                      bike2.fuel_tank_capacity_l
                        ? `${bike2.fuel_tank_capacity_l} Litres`
                        : '-'
                    }
                  />

                  <SpecRow
                    label="Fuel Economy (Approx.)"
                    val1={
                      bike1.fuel_consumption_kmpl
                        ? `${bike1.fuel_consumption_kmpl} km/L`
                        : '-'
                    }
                    val2={
                      bike2.fuel_consumption_kmpl
                        ? `${bike2.fuel_consumption_kmpl} km/L`
                        : '-'
                    }
                  />

                  <SpecRow
                    label="Ground Clearance"
                    val1={
                      bike1.ground_clearance_mm
                        ? `${bike1.ground_clearance_mm} mm`
                        : '-'
                    }
                    val2={
                      bike2.ground_clearance_mm
                        ? `${bike2.ground_clearance_mm} mm`
                        : '-'
                    }
                  />

                  <SpecRow
                    label="Seat Height"
                    val1={
                      bike1.saddle_height_mm
                        ? `${bike1.saddle_height_mm} mm`
                        : '-'
                    }
                    val2={
                      bike2.saddle_height_mm
                        ? `${bike2.saddle_height_mm} mm`
                        : '-'
                    }
                  />

                  <RowSection title="Electricals & Features" />

                  <SpecRow
                    label="Instrument Cluster"
                    val1={bike1.cluster}
                    val2={bike2.cluster}
                  />

                  <SpecRow
                    label="Headlamp"
                    val1={bike1.headlamp}
                    val2={bike2.headlamp}
                  />

                  <SpecRow
                    label="Bluetooth Connectivity"
                    val1={bike1.bluetooth_connectivity}
                    val2={bike2.bluetooth_connectivity}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* FOOTER LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 p-1">
                <img
                  src="/logo/bikefinderlogo.jpeg"
                  alt="BikeFinder"
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>

              <div>
                <p className="font-black text-lg">
                  BIKE
                  <span className="text-emerald-400">
                    FINDER
                  </span>
                </p>

                <p className="text-xs text-slate-500">
                  Discover your next ride.
                </p>
              </div>
            </div>

            {/* FOOTER LINKS */}
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link
                href="/"
                className="hover:text-white transition"
              >
                Explore
              </Link>

              <button
                onClick={scrollToComparison}
                className="hover:text-white transition"
              >
                Compare
              </button>

              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }
                className="hover:text-white transition"
              >
                Back to Top ↑
              </button>
            </div>
          </div>

          {/* CENTERED COPYRIGHT */}
          <div className="border-t border-white/10 mt-10 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 text-center">
              <p>
                © 2026 BikeFinder. All rights reserved.
              </p>

              <span className="hidden sm:block w-px h-5 bg-white/10" />

              <p>
                Developed with{' '}
                <span className="text-emerald-400">♥</span> by{' '}
                <span className="text-slate-300 font-bold">
                  Dishen
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function RowSection({
  title,
}: {
  title: string;
}) {
  return (
    <div className="bg-slate-950 px-4 sm:px-8 py-4">
      <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-[0.18em]">
        {title}
      </span>
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
    <div className="grid grid-cols-3 px-4 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm hover:bg-emerald-50/40 transition-colors">
      {/* LABEL */}
      <div className="text-slate-500 font-bold pr-3 flex items-center">
        {label}
      </div>

      {/* BIKE ONE */}
      <div className="text-slate-900 pr-3 sm:pr-5 flex items-center gap-2 font-semibold break-words">
        {brand1 && (
          <img
            src={`/logo/${brand1
              .toLowerCase()
              .trim()}.png`}
            alt=""
            className="hidden sm:block h-4 max-w-[40px] object-contain shrink-0"
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).style.display = 'none';
            }}
          />
        )}

        <span>{val1 || '-'}</span>
      </div>

      {/* BIKE TWO */}
      <div className="text-slate-900 border-l border-slate-200 pl-3 sm:pl-5 flex items-center gap-2 font-semibold break-words">
        {brand2 && (
          <img
            src={`/logo/${brand2
              .toLowerCase()
              .trim()}.png`}
            alt=""
            className="hidden sm:block h-4 max-w-[40px] object-contain shrink-0"
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).style.display = 'none';
            }}
          />
        )}

        <span>{val2 || '-'}</span>
      </div>
    </div>
  );
}