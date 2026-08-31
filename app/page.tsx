'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  torque_nm?: number;
  top_speed_kmph?: number;
  transmission?: string;
  abs?: string;
  traction_control?: string;
  kerb_weight_kg?: number;
  saddle_height_mm?: number;
  ground_clearance_mm?: number;
  fuel_consumption_kmpl?: string | number;
  image_url: string;
}

type FinderAnswers = {
  purpose: 'Daily' | 'Sport' | 'Touring' | 'Adventure' | 'City';
  experience: 'Beginner' | 'Intermediate' | 'Experienced';
  priority: 'Performance' | 'Economy' | 'Safety' | 'Comfort';
  engine: 'Any' | '125' | '150' | '200' | '250+';
};

export default function Home() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [minEngine, setMinEngine] = useState('');
  const [maxEngine, setMaxEngine] = useState('');
  const [minPower, setMinPower] = useState('');
  const [absOnly, setAbsOnly] = useState(false);
  const [tcOnly, setTcOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showFinder, setShowFinder] = useState(false);
  const [finderStep, setFinderStep] = useState(1);
  const [finder, setFinder] = useState<FinderAnswers>({
    purpose: 'Daily',
    experience: 'Intermediate',
    priority: 'Performance',
    engine: 'Any',
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBikes() {
      const { data, error } = await supabase.from('bikes').select('*');
      if (error) console.error(error);
      setBikes(data || []);
    }
    fetchBikes();
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const brands = useMemo(
    () => ['All', ...Array.from(new Set(bikes.map(b => b.brand).filter(Boolean))).sort()],
    [bikes]
  );
  const types = useMemo(
    () => ['All', ...Array.from(new Set(bikes.map(b => b.bike_type).filter(Boolean) as string[])).sort()],
    [bikes]
  );

  const filteredBikes = useMemo(() => bikes.filter(b => {
    const q = search.trim().toLowerCase();
    const engine = Number(b.engine_capacity);
    const power = Number(b.power_hp);
    const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.brand.toLowerCase().includes(q);
    const matchesBrand = selectedBrand === 'All' || b.brand === selectedBrand;
    const matchesType = selectedType === 'All' || b.bike_type === selectedType;
    const matchesMinEngine = !minEngine || engine >= Number(minEngine);
    const matchesMaxEngine = !maxEngine || engine <= Number(maxEngine);
    const matchesPower = !minPower || power >= Number(minPower);
    const matchesAbs = !absOnly || /yes|dual|single|standard|equipped/i.test(String(b.abs || ''));
    const matchesTc = !tcOnly || /yes|standard|available|equipped/i.test(String(b.traction_control || ''));
    return matchesSearch && matchesBrand && matchesType && matchesMinEngine && matchesMaxEngine &&
      matchesPower && matchesAbs && matchesTc;
  }), [bikes, search, selectedBrand, selectedType, minEngine, maxEngine, minPower, absOnly, tcOnly]);

  const suggestions = bikes
    .filter(b => search && `${b.brand} ${b.name}`.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6);

  const clearFilters = () => {
    setSearch(''); setSelectedBrand('All'); setSelectedType('All');
    setMinEngine(''); setMaxEngine(''); setMinPower(''); setAbsOnly(false); setTcOnly(false);
  };

  const finderResults = useMemo(() => {
    const score = (b: Bike) => {
      let s = 50;
      const type = (b.bike_type || '').toLowerCase();
      const power = Number(b.power_hp) || 0;
      const cc = Number(b.engine_capacity) || 0;
      const weight = Number(b.kerb_weight_kg) || 0;
      const mileage = parseFloat(String(b.fuel_consumption_kmpl || '').replace(/[^\d.]/g, '')) || 0;
      const purpose = finder.purpose.toLowerCase();

      if (purpose === 'sport') s += power >= 25 ? 18 : power >= 15 ? 10 : 0;
      if (purpose === 'daily' || purpose === 'city') s += mileage >= 40 ? 16 : mileage >= 30 ? 10 : 3;
      if (purpose === 'touring') s += cc >= 200 ? 14 : cc >= 150 ? 8 : 2;
      if (purpose === 'adventure') s += /adventure|dual sport|enduro/i.test(type) ? 20 : Number(b.ground_clearance_mm) >= 180 ? 10 : 0;
      if (finder.priority === 'Performance') s += power >= 20 ? 15 : 7;
      if (finder.priority === 'Economy') s += mileage >= 40 ? 15 : mileage >= 30 ? 8 : 0;
      if (finder.priority === 'Safety') s += /yes|dual|single|standard|equipped/i.test(String(b.abs || '')) ? 15 : 0;
      if (finder.priority === 'Comfort') s += weight > 0 && weight <= 170 ? 7 : 3;
      if (finder.experience === 'Beginner') s += cc <= 200 ? 12 : 0;
      if (finder.experience === 'Experienced') s += cc >= 200 ? 10 : 2;
      if (finder.engine === '125') s += cc >= 100 && cc <= 149 ? 18 : 0;
      if (finder.engine === '150') s += cc >= 140 && cc <= 199 ? 18 : 0;
      if (finder.engine === '200') s += cc >= 180 && cc <= 249 ? 18 : 0;
      if (finder.engine === '250+') s += cc >= 250 ? 18 : 0;
      return Math.max(0, Math.min(99, Math.round(s)));
    };
    return bikes.map(b => ({ bike: b, score: score(b) })).sort((a, b) => b.score - a.score).slice(0, 3);
  }, [bikes, finder]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900 overflow-x-hidden">
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-400/10 blur-[130px] rounded-full" />
        <div className="absolute top-[30%] -left-48 w-[500px] h-[500px] bg-cyan-400/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo/bikefinderlogo.jpeg" alt="BikeFinder" className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
              <div><p className="text-xl sm:text-2xl font-black">BIKE<span className="text-emerald-500">FINDER</span></p><p className="text-[10px] text-slate-400 font-semibold tracking-wide">DISCOVER. COMPARE. RIDE.</p></div>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollTo('explore-bikes')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600">Explore Bikes</button>
              <button onClick={() => scrollTo('categories')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600">Categories</button>
              <button onClick={() => scrollTo('why-us')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600">Why BikeFinder</button>
            </nav>
            <div className="hidden sm:flex gap-3">
              <button onClick={() => setShowFinder(true)} className="px-5 py-3 rounded-full text-sm font-bold border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">Smart Finder</button>
              <Link href="/compare" className="px-5 py-3 rounded-full text-sm font-bold bg-slate-950 text-white hover:bg-emerald-600">Compare →</Link>
            </div>
            <button onClick={() => setMobileMenuOpen(v => !v)} className="lg:hidden w-11 h-11 rounded-xl bg-slate-100">{mobileMenuOpen ? '✕' : '☰'}</button>
          </div>
          {mobileMenuOpen && <div className="lg:hidden pb-5 pt-3 border-t flex flex-col gap-3">
            <button onClick={() => { setShowFinder(true); setMobileMenuOpen(false); }} className="text-left font-bold text-emerald-700">Smart Bike Finder</button>
            <button onClick={() => { scrollTo('explore-bikes'); setMobileMenuOpen(false); }} className="text-left font-semibold">Explore Bikes</button>
            <Link href="/compare" className="bg-slate-950 text-white p-3 rounded-xl font-bold text-center">Compare Bikes</Link>
          </div>}
        </div>
      </header>

      <section className="pt-20 pb-16 sm:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white border rounded-full px-4 py-2 mb-7 shadow-sm"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span className="text-xs font-bold text-slate-600">THE SMARTER WAY TO FIND YOUR MOTORCYCLE</span></div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">Find Your Next<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-500">Perfect Motorcycle.</span></h2>
          <p className="max-w-2xl mx-auto mt-7 text-base sm:text-lg text-slate-500 leading-8">Explore detailed motorcycle specifications, discover the right bikes for your needs, and compare motorcycles side by side.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">
            <button onClick={() => setShowFinder(true)} className="bg-slate-950 hover:bg-emerald-600 text-white px-7 py-4 rounded-2xl font-bold shadow-xl">Find My Bike ✦</button>
            <button onClick={() => scrollTo('explore-bikes')} className="bg-white border px-7 py-4 rounded-2xl font-bold">Explore Motorcycles →</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
            {[['' + bikes.length + '+', 'Motorcycles'], ['' + Math.max(0, brands.length - 1) + '+', 'Brands'], ['100%', 'Free to Explore'], ['24/7', 'Always Available']].map(([a, b]) => <div key={b} className="bg-white border rounded-2xl p-5 shadow-sm"><p className="text-2xl sm:text-3xl font-black">{a}</p><p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{b}</p></div>)}
          </div>
        </div>
      </section>

      <section id="categories" className="py-16 sm:py-24 border-y bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">Find Your Style</span>
          <h2 className="text-3xl sm:text-5xl font-black mt-3">Browse by Category</h2>
          <p className="text-slate-500 mt-4 max-w-xl">Explore motorcycles by riding style and category.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
            {['Sport', 'Naked', 'Adventure', 'Cruiser', 'Scooter', 'Touring'].map((type, i) => (
              <button key={type} onClick={() => { setSelectedType(type); scrollTo('explore-bikes'); }} className="bg-white border rounded-2xl p-5 text-left hover:border-emerald-500 hover:-translate-y-1 transition">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">{['🏎️', '⚡', '🌍', '🔥', '🛵', '🛣️'][i]}</div>
                <p className="font-black mt-4">{type}</p><p className="text-xs text-slate-400 mt-1">Explore bikes →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="explore-bikes" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">Motorcycle Database</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3">Explore Motorcycles</h2>
            <p className="text-slate-500 mt-4">Search and filter motorcycles using technical specifications — no country-specific pricing required.</p>
          </div>

          <div className="relative z-30 bg-white border rounded-3xl shadow-xl p-3 sm:p-4 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative" ref={searchRef}>
                <input value={search} onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} placeholder="Search motorcycle or brand..." className="w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:bg-white focus:border-emerald-500" />
                {showSuggestions && suggestions.length > 0 && <div className="absolute top-full mt-2 left-0 right-0 bg-white border rounded-2xl shadow-2xl overflow-hidden z-50">{suggestions.map(b => <button key={b.id} onClick={() => { setSearch(b.name); setShowSuggestions(false); }} className="w-full p-4 text-left hover:bg-emerald-50 border-b last:border-0"><b>{b.name}</b><span className="block text-xs text-slate-400 mt-1">{b.brand} • {b.engine_capacity} cc</span></button>)}</div>}
              </div>
              <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-bold outline-none"><option value="All">All Brands</option>{brands.slice(1).map(b => <option key={b}>{b}</option>)}</select>
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-bold outline-none"><option value="All">All Categories</option>{types.slice(1).map(t => <option key={t}>{t}</option>)}</select>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button onClick={() => setShowFilters(v => !v)} className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-bold hover:bg-emerald-50">⚙ Advanced Filters {showFilters ? '↑' : '↓'}</button>
              <button onClick={() => setShowFinder(true)} className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold">✦ Smart Finder</button>
              {(search || selectedBrand !== 'All' || selectedType !== 'All' || minEngine || maxEngine || minPower || absOnly || tcOnly) && <button onClick={clearFilters} className="px-4 py-2 text-sm font-bold text-emerald-700">Clear All</button>}
              <span className="ml-auto text-sm text-slate-500"><b className="text-slate-900">{filteredBikes.length}</b> matches</span>
            </div>
            {showFilters && <div className="mt-4 p-4 bg-slate-50 rounded-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <input type="number" value={minEngine} onChange={e => setMinEngine(e.target.value)} placeholder="Min CC" className="border bg-white rounded-xl px-3 py-3 text-sm" />
              <input type="number" value={maxEngine} onChange={e => setMaxEngine(e.target.value)} placeholder="Max CC" className="border bg-white rounded-xl px-3 py-3 text-sm" />
              <input type="number" value={minPower} onChange={e => setMinPower(e.target.value)} placeholder="Min HP" className="border bg-white rounded-xl px-3 py-3 text-sm" />
              <label className="bg-white border rounded-xl px-3 py-3 text-sm font-bold flex gap-2 items-center"><input type="checkbox" checked={absOnly} onChange={e => setAbsOnly(e.target.checked)} /> ABS</label>
              <label className="bg-white border rounded-xl px-3 py-3 text-sm font-bold flex gap-2 items-center"><input type="checkbox" checked={tcOnly} onChange={e => setTcOnly(e.target.checked)} /> Traction</label>
              <button onClick={clearFilters} className="bg-slate-950 text-white rounded-xl px-3 py-3 text-sm font-bold">Reset</button>
            </div>}
          </div>

          {filteredBikes.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredBikes.map(bike => <article key={bike.id} className="group bg-white border rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center overflow-hidden">
                <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">{bike.bike_type && <span className="bg-white/95 border rounded-full px-3 py-1.5 text-[10px] font-black uppercase">{bike.bike_type}</span>}{bike.model_year && <span className="bg-slate-950 text-white rounded-full px-3 py-1.5 text-[10px] font-bold">{bike.model_year}</span>}</div>
                {bike.image_url ? <img src={bike.image_url} alt={bike.name} className="max-w-[88%] max-h-[74%] object-contain translate-y-4 group-hover:scale-105 transition duration-700 drop-shadow-2xl" /> : <span className="text-6xl opacity-20">🏍️</span>}
              </div>
              <div className="p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">{bike.brand}</p>
                <h3 className="text-xl font-black mt-2">{bike.name}</h3>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-slate-50 border rounded-xl p-3"><p className="text-[9px] font-black text-slate-400 uppercase">Engine</p><p className="font-black mt-1">{bike.engine_capacity} <small>cc</small></p></div>
                  <div className="bg-slate-50 border rounded-xl p-3"><p className="text-[9px] font-black text-slate-400 uppercase">Power</p><p className="font-black mt-1">{bike.power_hp} <small>HP</small></p></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-500"><span>Torque: <b>{bike.torque_nm ?? '-'}</b> Nm</span><span>Top speed: <b>{bike.top_speed_kmph ?? '-'}</b> km/h</span></div>
                <div className="flex gap-2 mt-5">
                  <Link href={`/bikes/${bike.id}`} className="flex-1 text-center bg-slate-950 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-emerald-600">View Specs →</Link>
                  <Link href={`/compare?bike1=${bike.id}`} className="px-4 py-3.5 rounded-xl border font-bold text-sm hover:border-emerald-500">Compare</Link>
                </div>
              </div>
            </article>)}
          </div> : <div className="bg-white border border-dashed rounded-3xl p-16 text-center"><div className="text-5xl">🏍️</div><h3 className="text-xl font-black mt-4">No motorcycles found</h3><p className="text-sm text-slate-500 mt-2">Try adjusting your technical filters.</p><button onClick={clearFilters} className="mt-6 bg-slate-950 text-white px-6 py-3 rounded-xl font-bold">Reset Filters</button></div>}
        </div>
      </section>

      <section id="why-us" className="py-20 sm:py-28 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-black text-emerald-400 tracking-[0.2em] uppercase">Why BikeFinder</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-4">Research motorcycles.<br /><span className="text-emerald-400">Make better comparisons.</span></h2>
          <p className="text-slate-400 mt-5 max-w-2xl leading-8">BikeFinder focuses on specifications, useful filters and transparent comparisons that work for riders anywhere in the world.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[['🔎', 'Advanced Search', 'Filter motorcycles by technical specifications, not location-specific pricing.'], ['✦', 'Smart Finder', 'Answer a few questions and get database-powered matches.'], ['⚖️', 'Better Comparison', 'See differences and category winners at a glance.'], ['🌍', 'Global Focus', 'A specification-first motorcycle research platform for riders everywhere.']].map(([i, t, d]) => <div key={t} className="bg-white/[0.04] border border-white/10 rounded-3xl p-6"><div className="text-2xl">{i}</div><h3 className="font-black text-lg mt-6">{t}</h3><p className="text-sm text-slate-400 leading-6 mt-3">{d}</p></div>)}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Brand */}
            <div className="text-center md:text-left">
              <p className="font-black text-lg">
                BIKE<span className="text-emerald-400">FINDER</span>
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Discover. Compare. Ride.
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold">

              <Link
                href="/"
                className="text-slate-500 hover:text-emerald-400 transition"
              >
                Home
              </Link>

              <button
                onClick={() => scrollTo('explore-bikes')}
                className="text-slate-500 hover:text-emerald-400 transition"
              >
                Explore Bikes
              </button>

              <Link
                href="/compare"
                className="text-slate-500 hover:text-emerald-400 transition"
              >
                Compare
              </Link>

              {/* Specification Guide */}
              <Link
                href="/about/specifications"
                className="text-slate-500 hover:text-emerald-400 transition"
              >
                Specification Guide
              </Link>

            </div>

            {/* Specs & Data Sources */}
            <Link
              href="/about/specifications"
              className="group flex items-center gap-3 bg-white/[0.04] border border-white/10 hover:border-emerald-400/40 px-4 py-3 rounded-xl transition-all"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:animate-pulse" />

              <div>
                <p className="text-xs font-bold text-slate-300 group-hover:text-emerald-400 transition">
                  Specs & Data Sources
                </p>

                <p className="text-[10px] text-slate-600 mt-0.5">
                  Accuracy & methodology →
                </p>
              </div>
            </Link>

          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">

            <p>
              © {new Date().getFullYear()} BikeFinder. All rights reserved.
            </p>

            <p>
              Developed with{' '}
              <span className="text-emerald-400">♥</span>{' '}
              by{' '}
              <b className="text-slate-300">
                Dishen
              </b>
            </p>

          </div>

        </div>
      </footer>

      {showFinder && <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b flex justify-between items-start"><div><p className="text-xs font-black text-emerald-600 uppercase tracking-widest">BikeFinder Smart Finder</p><h3 className="text-2xl sm:text-3xl font-black mt-2">Find bikes that fit your riding style.</h3><p className="text-sm text-slate-500 mt-2">Uses the specifications already in your BikeFinder database.</p></div><button onClick={() => { setShowFinder(false); setFinderStep(1); }} className="w-10 h-10 rounded-xl bg-slate-100">✕</button></div>
          <div className="p-6 sm:p-8">
            {finderStep <= 4 ? <><p className="text-xs font-bold text-slate-400 mb-5">STEP {finderStep} OF 4</p>
              {finderStep === 1 && <Question title="What will you mainly use it for?" options={['Daily', 'Sport', 'Touring', 'Adventure', 'City']} value={finder.purpose} onChange={v => setFinder({ ...finder, purpose: v as FinderAnswers['purpose'] })} />}
              {finderStep === 2 && <Question title="How experienced are you?" options={['Beginner', 'Intermediate', 'Experienced']} value={finder.experience} onChange={v => setFinder({ ...finder, experience: v as FinderAnswers['experience'] })} />}
              {finderStep === 3 && <Question title="What matters most to you?" options={['Performance', 'Economy', 'Safety', 'Comfort']} value={finder.priority} onChange={v => setFinder({ ...finder, priority: v as FinderAnswers['priority'] })} />}
              {finderStep === 4 && <Question title="Preferred engine range?" options={['Any', '125', '150', '200', '250+']} value={finder.engine} onChange={v => setFinder({ ...finder, engine: v as FinderAnswers['engine'] })} />}
              <div className="flex justify-between mt-8"><button disabled={finderStep === 1} onClick={() => setFinderStep(s => s - 1)} className="px-5 py-3 rounded-xl border font-bold disabled:opacity-30">Back</button><button onClick={() => setFinderStep(s => s + 1)} className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold">{finderStep === 4 ? 'Show Matches' : 'Continue →'}</button></div>
            </> : <div><div className="flex justify-between items-center mb-6"><div><p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Your Matches</p><h3 className="text-2xl font-black mt-1">Top motorcycles for you</h3></div><button onClick={() => setFinderStep(1)} className="text-sm font-bold text-slate-500">Retake</button></div>
              <div className="space-y-3">{finderResults.map((r, i) => <Link key={r.bike.id} href={`/bikes/${r.bike.id}`} onClick={() => setShowFinder(false)} className="flex items-center gap-4 border rounded-2xl p-4 hover:border-emerald-400 hover:bg-emerald-50/40 transition"><div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center"><img src={r.bike.image_url} alt="" className="max-w-[90%] max-h-[80%] object-contain" /></div><div className="flex-1"><p className="text-xs font-black text-emerald-600">#{i + 1} MATCH</p><p className="font-black">{r.bike.name}</p><p className="text-xs text-slate-500">{r.bike.brand} • {r.bike.engine_capacity} cc • {r.bike.power_hp} HP</p></div><div className="text-right"><p className="text-2xl font-black text-emerald-600">{r.score}%</p><p className="text-[10px] text-slate-400 font-bold uppercase">Match</p></div></Link>)}</div>
            </div>}
          </div>
        </div>
      </div>}
    </main>
  );
}

function Question({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return <div><h4 className="text-xl sm:text-2xl font-black mb-5">{title}</h4><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{options.map(o => <button key={o} onClick={() => onChange(o)} className={`p-4 rounded-2xl border text-left font-bold transition ${value === o ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'hover:border-slate-400'}`}>{o}</button>)}</div></div>;
}
