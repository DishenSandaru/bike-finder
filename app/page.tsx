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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const brands = [
    'All',
    ...Array.from(new Set(bikes.map((b) => b.brand).filter(Boolean))),
  ];

  const types = [
    'All',
    ...Array.from(new Set(bikes.map((b) => b.bike_type).filter(Boolean))),
  ];

  const suggestions = bikes
    .filter(
      (b) =>
        search.trim() !== '' &&
        (b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.brand.toLowerCase().includes(search.toLowerCase()))
    )
    .slice(0, 6);

  const filteredBikes = bikes.filter((bike) => {
    const matchesSearch =
      bike.name.toLowerCase().includes(search.toLowerCase()) ||
      bike.brand.toLowerCase().includes(search.toLowerCase());

    const matchesBrand =
      selectedBrand === 'All' || bike.brand === selectedBrand;

    const matchesType =
      selectedType === 'All' || bike.bike_type === selectedType;

    return matchesSearch && matchesBrand && matchesType;
  });

  const scrollToBikes = () => {
    document
      .getElementById('explore-bikes')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectCategory = (type: string) => {
    setSelectedType(type);

    setTimeout(() => {
      document
        .getElementById('explore-bikes')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
            <Link href="/" className="flex items-center gap-3 group">
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
                  BIKE<span className="text-emerald-500">FINDER</span>
                </h1>

                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wide mt-1">
                  DISCOVER. COMPARE. RIDE.
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <button
                onClick={scrollToBikes}
                className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
              >
                Explore Bikes
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById('categories')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
              >
                Categories
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById('why-us')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
              >
                Why BikeFinder
              </button>
            </nav>

            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/compare"
                className="group inline-flex items-center gap-2 bg-slate-950 hover:bg-emerald-600 text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Compare Bikes
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-5 flex flex-col gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => {
                  scrollToBikes();
                  setMobileMenuOpen(false);
                }}
                className="text-left font-semibold text-slate-600"
              >
                Explore Bikes
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById('categories')
                    ?.scrollIntoView({ behavior: 'smooth' });

                  setMobileMenuOpen(false);
                }}
                className="text-left font-semibold text-slate-600"
              >
                Categories
              </button>

              <Link
                href="/compare"
                className="bg-slate-950 text-white py-3 px-5 rounded-xl font-bold text-center"
              >
                Compare Bikes →
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-2 mb-7">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />

              <span className="text-xs font-bold text-slate-600">
                THE SMARTER WAY TO FIND YOUR MOTORCYCLE
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-950">
              Find Your Next
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-500">
                Perfect Motorcycle.
              </span>
            </h2>

            <p className="max-w-2xl mx-auto mt-7 text-base sm:text-lg text-slate-500 leading-8">
              Explore detailed motorcycle specifications, discover the latest
              models, and compare bikes side by side before you choose your
              next ride.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">
              <button
                onClick={scrollToBikes}
                className="group inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-emerald-600 text-white px-7 py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                Explore Motorcycles
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              <Link
                href="/compare"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-7 py-4 rounded-2xl font-bold shadow-sm transition-all duration-300"
              >
                ⚖ Compare Bikes
              </Link>
            </div>
          </div>

          <div className="relative mt-16 max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 blur-3xl rounded-[3rem]" />

            <div className="relative bg-slate-950 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30" />

              <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                  <div className="inline-flex w-fit bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6">
                    <span className="text-xs font-bold text-emerald-400">
                      BUILT FOR RIDERS
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                    Every Specification.
                    <br />
                    <span className="text-emerald-400">
                      One Smart Place.
                    </span>
                  </h3>

                  <p className="text-slate-400 mt-5 leading-7 max-w-md">
                    Engine performance, power, specifications and more.
                    Everything you need to research your next motorcycle.
                  </p>

                  <button
                    onClick={scrollToBikes}
                    className="mt-8 w-fit text-white font-bold inline-flex items-center gap-2 hover:text-emerald-400 transition"
                  >
                    Start Exploring <span>→</span>
                  </button>
                </div>

                <div className="relative min-h-[320px] lg:min-h-full overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.25),_transparent_65%)]" />

                  <div className="absolute top-10 right-10 w-40 h-40 border border-white/5 rounded-full" />
                  <div className="absolute bottom-10 left-10 w-56 h-56 border border-emerald-500/10 rounded-full" />

                  {bikes.length > 0 ? (
                    <img
                      src={bikes[0].image_url}
                      alt={bikes[0].name}
                      className="relative z-10 max-h-[330px] max-w-[90%] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-8xl opacity-30">🏍️</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-slate-950">
                {bikes.length}+
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                Motorcycles
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-slate-950">
                {brands.length - 1}+
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                Brands
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-slate-950">
                100%
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                Free to Explore
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-slate-950">
                24/7
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                Always Available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        id="categories"
        className="py-16 sm:py-24 border-y border-slate-200/70 bg-white/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
                Find Your Style
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 mt-3">
                Browse by Category
              </h2>

              <p className="text-slate-500 mt-4 max-w-xl">
                From powerful sport bikes to comfortable touring machines,
                discover motorcycles that match your riding style.
              </p>
            </div>

            <button
              onClick={scrollToBikes}
              className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition"
            >
              View All Motorcycles →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '🏎️', name: 'Sport', query: 'Sport' },
              { icon: '⚡', name: 'Naked', query: 'Naked' },
              { icon: '🌍', name: 'Adventure', query: 'Adventure' },
              { icon: '🔥', name: 'Cruiser', query: 'Cruiser' },
              { icon: '🛵', name: 'Scooter', query: 'Scooter' },
              { icon: '🛣️', name: 'Touring', query: 'Touring' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => selectCategory(category.query)}
                className="group bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-emerald-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-emerald-50 transition">
                  {category.icon}
                </div>

                <p className="font-black text-slate-900 mt-4">
                  {category.name}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Explore bikes →
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE BIKES */}
      <section
        id="explore-bikes"
        className="py-20 sm:py-28 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
              Motorcycle Database
            </span>

            <h2 className="text-4xl sm:text-5xl font-black text-slate-950 mt-3">
              Explore Motorcycles
            </h2>

            <p className="text-slate-500 mt-4">
              Search and filter through our growing motorcycle database to find
              exactly what you are looking for.
            </p>
          </div>

          {/* SEARCH & FILTER */}
          <div className="relative z-40 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/40 p-3 sm:p-4 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                    🔍
                  </span>

                  <input
                    type="text"
                    placeholder="Search motorcycles or brands..."
                    value={search}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                  />
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {suggestions.map((bike) => (
                      <button
                        key={bike.id}
                        onClick={() => {
                          setSearch(bike.name);
                          setShowSuggestions(false);
                        }}
                        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-emerald-50 text-left transition border-b border-slate-100 last:border-0"
                      >
                        <div>
                          <p className="font-bold text-sm text-slate-900">
                            {bike.name}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {bike.brand} • {bike.engine_capacity} cc
                          </p>
                        </div>

                        <span className="text-emerald-600">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer focus:bg-white focus:border-emerald-500 transition"
                >
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand === 'All' ? 'All Brands' : brand}
                    </option>
                  ))}
                </select>

                <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ↓
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer focus:bg-white focus:border-emerald-500 transition"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All Categories' : type}
                    </option>
                  ))}
                </select>

                <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ↓
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-4">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-black text-slate-900">
                  {filteredBikes.length}
                </span>{' '}
                motorcycles
              </p>

              {(search ||
                selectedBrand !== 'All' ||
                selectedType !== 'All') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedBrand('All');
                    setSelectedType('All');
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Clear Filters ✕
                </button>
              )}
            </div>
          </div>

          {/* BIKE GRID */}
          {filteredBikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredBikes.map((bike) => {
                const brandLogoName = bike.brand
                  ? bike.brand.toLowerCase().trim()
                  : '';

                return (
                  <article
                    key={bike.id}
                    className="group relative bg-white border border-slate-200 rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-300/40 hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="relative h-64 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {(bike.bike_type || bike.model_year) && (
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2 w-max max-w-[90%]">
                          {bike.bike_type && (
                            <span className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-3 py-1.5 text-[10px] font-black tracking-wider uppercase text-slate-600 whitespace-nowrap shadow-sm">
                              {bike.bike_type}
                            </span>
                          )}

                          {bike.model_year && (
                            <span className="bg-slate-950 text-white rounded-full px-3 py-1.5 text-[10px] font-bold whitespace-nowrap shadow-sm">
                              {bike.model_year}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08),_transparent_65%)]" />

                      <div className="absolute inset-x-0 top-10 bottom-0 flex items-center justify-center">
                        <img
                          src={bike.image_url}
                          alt={bike.name}
                          className="relative z-10 max-w-[90%] max-h-[82%] object-contain group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-700 ease-out drop-shadow-2xl"
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-7 min-w-7 max-w-[50px] px-1 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                          <img
                            src={`/logo/${brandLogoName}.png`}
                            alt={bike.brand}
                            className="max-h-4 max-w-[42px] object-contain"
                            onError={(e) => {
                              (
                                e.target as HTMLImageElement
                              ).style.display = 'none';
                            }}
                          />
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">
                          {bike.brand}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-950 group-hover:text-emerald-600 transition-colors duration-300">
                        {bike.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                            Engine
                          </p>

                          <p className="text-base font-black text-slate-900 mt-1">
                            {bike.engine_capacity}
                            <span className="text-xs text-slate-400 ml-1">
                              cc
                            </span>
                          </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                            Power
                          </p>

                          <p className="text-base font-black text-slate-900 mt-1">
                            {bike.power_hp}
                            <span className="text-xs text-slate-400 ml-1">
                              HP
                            </span>
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/bikes/${bike.id}`}
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-slate-950 group-hover:bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold transition-all duration-300"
                      >
                        View Full Specifications
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center bg-white border border-dashed border-slate-300 rounded-3xl p-16">
              <div className="text-5xl mb-5">🏍️</div>

              <h3 className="text-xl font-black text-slate-900">
                No motorcycles found
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Try changing your search or filters.
              </p>

              <button
                onClick={() => {
                  setSearch('');
                  setSelectedBrand('All');
                  setSelectedType('All');
                }}
                className="mt-6 bg-slate-950 text-white px-6 py-3 rounded-xl text-sm font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* WHY BIKEFINDER */}
      <section
        id="why-us"
        className="py-20 sm:py-28 bg-slate-950 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-black text-emerald-400 tracking-[0.2em] uppercase">
              Why BikeFinder
            </span>

            <h2 className="text-4xl sm:text-5xl font-black mt-4 leading-tight">
              Built for riders who
              <span className="text-emerald-400"> want to know more.</span>
            </h2>

            <p className="text-slate-400 mt-5 leading-8">
              BikeFinder makes researching motorcycles simple, fast and easy.
              Everything is designed to help you understand and compare bikes
              before making a decision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              {
                icon: '⚙️',
                title: 'Detailed Specs',
                text: 'Quick access to important motorcycle specifications.',
              },
              {
                icon: '⚖️',
                title: 'Easy Comparison',
                text: 'Compare motorcycles side by side and find the differences.',
              },
              {
                icon: '🔎',
                title: 'Smart Search',
                text: 'Find motorcycles by model, brand or category.',
              },
              {
                icon: '🌍',
                title: 'Built for Everyone',
                text: 'A simple platform designed for motorcycle enthusiasts everywhere.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-3xl p-6 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                  {feature.icon}
                </div>

                <h3 className="font-black text-lg mt-6">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-400 leading-6 mt-3">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 border border-white/10 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Ready to find your next ride?
              </h3>

              <p className="text-slate-400 mt-2">
                Start exploring motorcycles and discover the perfect match.
              </p>
            </div>

            <button
              onClick={scrollToBikes}
              className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-7 py-4 rounded-2xl font-black transition-all hover:-translate-y-1"
            >
              Explore Bikes →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
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
                  BIKE<span className="text-emerald-400">FINDER</span>
                </p>

                <p className="text-xs text-slate-500">
                  Discover your next ride.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-400">
              <button
                onClick={scrollToBikes}
                className="hover:text-white transition"
              >
                Explore
              </button>

              <Link href="/compare" className="hover:text-white transition">
                Compare
              </Link>

              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                className="hover:text-white transition"
              >
                Back to Top ↑
              </button>
            </div>
          </div>

          {/* CENTERED COPYRIGHT SECTION */}
          <div className="border-t border-white/10 mt-10 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 text-center">
              <p>
                © 2026 BikeFinder. All rights reserved.
              </p>

              <span className="hidden sm:block w-px h-5 bg-white/10" />

              <p>
                Developed with{' '}
                <span className="text-emerald-400">♥</span> by{' '}
                <span className="text-slate-300 font-bold">Dishen</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}