'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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

type SortKey = 'relevance' | 'name-asc' | 'power-desc' | 'engine-desc' | 'speed-desc';

const SORT_LABELS: Record<SortKey, string> = {
  relevance: 'Relevance',
  'name-asc': 'Name (A-Z)',
  'power-desc': 'Power (High to Low)',
  'engine-desc': 'Engine cc (High to Low)',
  'speed-desc': 'Top Speed (High to Low)',
};

const FAVORITES_KEY = 'bikefinder_favorites';
const PAGE_SIZE = 9;

const FAQS = [
  {
    q: 'Is BikeFinder free to use?',
    a: 'Yes. Every specification, filter, comparison and the Smart Finder are completely free — no account required.',
  },
  {
    q: 'Where do the specifications come from?',
    a: 'We compile figures from manufacturer data sheets and cross-check them for accuracy. See the Specs & Data Sources page for full methodology.',
  },
  {
    q: 'Can I save motorcycles to look at later?',
    a: 'Yes — tap the heart icon on any bike card to add it to your favorites. Favorites are saved on this device.',
  },
  {
    q: 'How does the Smart Finder pick matches?',
    a: 'It scores every motorcycle in the database against your answers on usage, experience, priorities and preferred engine size, then shows the closest matches.',
  },
];

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  const router = useRouter();

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [minEngine, setMinEngine] = useState('');
  const [maxEngine, setMaxEngine] = useState('');
  const [minPower, setMinPower] = useState('');
  const [absOnly, setAbsOnly] = useState(false);
  const [tcOnly, setTcOnly] = useState(false);
  const [favOnly, setFavOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  const [favorites, setFavorites] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBikes() {
      setLoading(true);
      const { data, error } = await supabase.from('bikes').select('*');
      if (error) console.error(error);
      setBikes(data || []);
      setLoading(false);
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

  // Load favorites from this device on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const showToast = (message: string) => setToast(message);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleFavorite = (id: string, name: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter(f => f !== id) : [...prev, id];
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // ignore storage failures (e.g. private browsing)
      }
      showToast(isFav ? `Removed ${name} from favorites` : `Saved ${name} to favorites`);
      return next;
    });
  };

  // Floating "back to top" visibility.
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    const q = debouncedSearch.trim().toLowerCase();
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
    const matchesFav = !favOnly || favorites.includes(b.id);
    return matchesSearch && matchesBrand && matchesType && matchesMinEngine && matchesMaxEngine &&
      matchesPower && matchesAbs && matchesTc && matchesFav;
  }), [bikes, debouncedSearch, selectedBrand, selectedType, minEngine, maxEngine, minPower, absOnly, tcOnly, favOnly, favorites]);

  const sortedBikes = useMemo(() => {
    const arr = [...filteredBikes];
    switch (sortBy) {
      case 'name-asc':
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case 'power-desc':
        return arr.sort((a, b) => Number(b.power_hp || 0) - Number(a.power_hp || 0));
      case 'engine-desc':
        return arr.sort((a, b) => Number(b.engine_capacity || 0) - Number(a.engine_capacity || 0));
      case 'speed-desc':
        return arr.sort((a, b) => Number(b.top_speed_kmph || 0) - Number(a.top_speed_kmph || 0));
      default:
        return arr;
    }
  }, [filteredBikes, sortBy]);

  // Reset pagination whenever the result set changes.
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [debouncedSearch, selectedBrand, selectedType, minEngine, maxEngine, minPower, absOnly, tcOnly, favOnly, sortBy]);

  const visibleBikes = sortedBikes.slice(0, visibleCount);

  const activeFilterCount = [
    selectedBrand !== 'All',
    selectedType !== 'All',
    !!minEngine,
    !!maxEngine,
    !!minPower,
    absOnly,
    tcOnly,
    favOnly,
  ].filter(Boolean).length;

  const suggestions = bikes
    .filter(b => search && `${b.brand} ${b.name}`.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6);

  const clearFilters = () => {
    setSearch(''); setSelectedBrand('All'); setSelectedType('All');
    setMinEngine(''); setMaxEngine(''); setMinPower(''); setAbsOnly(false); setTcOnly(false);
    setFavOnly(false); setSortBy('relevance');
  };

  const surpriseMe = () => {
    if (!bikes.length) return;
    const random = bikes[Math.floor(Math.random() * bikes.length)];
    router.push(`/bikes/${random.id}`);
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
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
              <img
                src="https://ohazkgtidtbzbdtzaqnl.supabase.co/storage/v1/object/public/bikes/logos/bikefinderlogo.jpeg"
                alt="BikeFinder"
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <div><p className="text-xl sm:text-2xl font-black">BIKE<span className="text-emerald-500">FINDER</span></p><p className="text-[10px] text-slate-400 font-semibold tracking-wide">DISCOVER. COMPARE. RIDE.</p></div>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollTo('explore-bikes')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600">Explore Bikes</button>
              <button onClick={() => scrollTo('categories')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600">Categories</button>
              <button onClick={() => scrollTo('why-us')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600">Why BikeFinder</button>
              <button onClick={() => scrollTo('faq')} className="text-sm font-semibold text-slate-500 hover:text-emerald-600">FAQ</button>
            </nav>
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => { setFavOnly(true); scrollTo('explore-bikes'); }}
                title="View favorites"
                className="relative w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center hover:border-emerald-400 hover:bg-emerald-50 transition"
              >
                <span className={favorites.length ? 'text-rose-500' : 'text-slate-400'}>♥</span>
                {favorites.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{favorites.length}</span>}
              </button>
              <button onClick={() => setShowFinder(true)} className="px-5 py-3 rounded-full text-sm font-bold border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">Smart Finder</button>
              <Link href="/compare" className="px-5 py-3 rounded-full text-sm font-bold bg-slate-950 text-white hover:bg-emerald-600">Compare →</Link>
            </div>
            <button onClick={() => setMobileMenuOpen(v => !v)} className="lg:hidden w-11 h-11 rounded-xl bg-slate-100">{mobileMenuOpen ? '✕' : '☰'}</button>
          </div>
          {mobileMenuOpen && <div className="lg:hidden pb-5 pt-3 border-t flex flex-col gap-3">
            <button onClick={() => { setShowFinder(true); setMobileMenuOpen(false); }} className="text-left font-bold text-emerald-700">Smart Bike Finder</button>
            <button onClick={() => { scrollTo('explore-bikes'); setMobileMenuOpen(false); }} className="text-left font-semibold">Explore Bikes</button>
            <button onClick={() => { setFavOnly(true); scrollTo('explore-bikes'); setMobileMenuOpen(false); }} className="text-left font-semibold">My Favorites ({favorites.length})</button>
            <button onClick={() => { scrollTo('faq'); setMobileMenuOpen(false); }} className="text-left font-semibold">FAQ</button>
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
            <button onClick={surpriseMe} disabled={!bikes.length} className="bg-white border px-7 py-4 rounded-2xl font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50 disabled:opacity-40">Surprise Me 🎲</button>
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
              <button onClick={() => setShowFilters(v => !v)} className="relative px-4 py-2 rounded-xl bg-slate-100 text-sm font-bold hover:bg-emerald-50">
                ⚙ Advanced Filters {showFilters ? '↑' : '↓'}
                {activeFilterCount > 0 && <span className="ml-1.5 inline-flex items-center justify-center bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full align-middle">{activeFilterCount}</span>}
              </button>
              <button onClick={() => setShowFinder(true)} className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold">✦ Smart Finder</button>
              <button onClick={() => setFavOnly(v => !v)} className={`px-4 py-2 rounded-xl text-sm font-bold border ${favOnly ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-500 hover:border-rose-200'}`}>♥ Favorites {favorites.length > 0 && `(${favorites.length})`}</button>

              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className="px-4 py-2 rounded-xl bg-white border text-sm font-bold outline-none">
                {(Object.keys(SORT_LABELS) as SortKey[]).map(k => <option key={k} value={k}>Sort: {SORT_LABELS[k]}</option>)}
              </select>

              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button onClick={() => setViewMode('grid')} title="Grid view" className={`px-3 py-1.5 rounded-lg text-sm font-bold ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>▦</button>
                <button onClick={() => setViewMode('list')} title="List view" className={`px-3 py-1.5 rounded-lg text-sm font-bold ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>☰</button>
              </div>

              {(search || selectedBrand !== 'All' || selectedType !== 'All' || minEngine || maxEngine || minPower || absOnly || tcOnly || favOnly || sortBy !== 'relevance') && <button onClick={clearFilters} className="px-4 py-2 text-sm font-bold text-emerald-700">Clear All</button>}
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

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border rounded-[1.75rem] overflow-hidden shadow-sm animate-pulse">
                  <div className="h-64 sm:h-72 bg-slate-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-2.5 w-16 bg-slate-100 rounded-full" />
                    <div className="h-5 w-3/4 bg-slate-100 rounded-full" />
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="h-14 bg-slate-100 rounded-xl" />
                      <div className="h-14 bg-slate-100 rounded-xl" />
                    </div>
                    <div className="h-11 bg-slate-100 rounded-xl mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBikes.length ? (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8' : 'flex flex-col gap-4'}>
                {visibleBikes.map(bike => viewMode === 'grid' ? (
                  <article key={bike.id} className="group bg-white border rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all">
                    <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center overflow-hidden">
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">{bike.bike_type && <span className="bg-white/95 border rounded-full px-3 py-1.5 text-[10px] font-black uppercase">{bike.bike_type}</span>}{bike.model_year && <span className="bg-slate-950 text-white rounded-full px-3 py-1.5 text-[10px] font-bold">{bike.model_year}</span>}</div>
                      <button
                        onClick={() => toggleFavorite(bike.id, bike.name)}
                        title={favorites.includes(bike.id) ? 'Remove from favorites' : 'Save to favorites'}
                        className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/95 border flex items-center justify-center hover:scale-110 transition"
                      >
                        <span className={favorites.includes(bike.id) ? 'text-rose-500' : 'text-slate-300'}>♥</span>
                      </button>
                      {bike.image_url ? <img src={bike.image_url} alt={bike.name} className="max-w-[88%] max-h-[74%] object-contain translate-y-4 group-hover:scale-105 transition duration-700 drop-shadow-2xl" /> : <span className="text-6xl opacity-20">🏍️</span>}
                    </div>
                    <div className="p-6">

                      {/* Brand Logo and Brand Name */}
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={`https://ohazkgtidtbzbdtzaqnl.supabase.co/storage/v1/object/public/bikes/logos/${bike.brand.toLowerCase()}.png`}
                          alt={bike.brand}
                          className="w-5 h-5 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">{bike.brand}</p>
                      </div>

                      <h3 className="text-xl font-black mt-1">{bike.name}</h3>
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
                  </article>
                ) : (
                  <article key={bike.id} className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row items-center gap-4 p-4">
                    <div className="relative w-full sm:w-40 h-32 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                      {bike.image_url ? <img src={bike.image_url} alt={bike.name} className="max-w-[90%] max-h-[85%] object-contain" /> : <span className="text-3xl opacity-20">🏍️</span>}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">{bike.brand}{bike.bike_type ? ` • ${bike.bike_type}` : ''}</p>
                          <h3 className="text-lg font-black">{bike.name}</h3>
                        </div>
                        <button onClick={() => toggleFavorite(bike.id, bike.name)} className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0">
                          <span className={favorites.includes(bike.id) ? 'text-rose-500' : 'text-slate-300'}>♥</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 mt-2">
                        <span>Engine: <b className="text-slate-800">{bike.engine_capacity} cc</b></span>
                        <span>Power: <b className="text-slate-800">{bike.power_hp} HP</b></span>
                        <span>Torque: <b className="text-slate-800">{bike.torque_nm ?? '-'} Nm</b></span>
                        <span>Top speed: <b className="text-slate-800">{bike.top_speed_kmph ?? '-'} km/h</b></span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <Link href={`/bikes/${bike.id}`} className="flex-1 text-center bg-slate-950 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-600 whitespace-nowrap">View Specs →</Link>
                      <Link href={`/compare?bike1=${bike.id}`} className="flex-1 text-center px-5 py-3 rounded-xl border font-bold text-sm hover:border-emerald-500 whitespace-nowrap">Compare</Link>
                    </div>
                  </article>
                ))}
              </div>
              {visibleCount < sortedBikes.length && (
                <div className="text-center mt-10">
                  <button onClick={() => setVisibleCount(v => v + PAGE_SIZE)} className="px-8 py-4 rounded-2xl bg-white border font-bold hover:border-emerald-500 hover:text-emerald-600 shadow-sm">
                    Load More ({sortedBikes.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-dashed rounded-3xl p-16 text-center">
              <div className="text-5xl">{favOnly ? '♡' : '🏍️'}</div>
              <h3 className="text-xl font-black mt-4">{favOnly ? 'No favorites yet' : 'No motorcycles found'}</h3>
              <p className="text-sm text-slate-500 mt-2">{favOnly ? 'Tap the heart icon on any bike to save it here.' : 'Try adjusting your technical filters.'}</p>
              <button onClick={clearFilters} className="mt-6 bg-slate-950 text-white px-6 py-3 rounded-xl font-bold">Reset Filters</button>
            </div>
          )}
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

      <section id="faq" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">Questions</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-3">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div key={item.q} className="bg-white border rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold">
                  <span>{item.q}</span>
                  <span className="text-emerald-600 shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className="px-5 pb-5 text-sm text-slate-500 leading-7">{item.a}</p>}
              </div>
            ))}
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

              <button
                onClick={() => scrollTo('faq')}
                className="text-slate-500 hover:text-emerald-400 transition"
              >
                FAQ
              </button>

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

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[200] bg-slate-950 text-white text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-2xl">
          {toast}
        </div>
      )}

      {/* Back to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Back to top"
          className="fixed bottom-6 right-6 z-[150] w-12 h-12 rounded-full bg-slate-950 text-white shadow-2xl hover:bg-emerald-600 transition flex items-center justify-center font-bold"
        >
          ↑
        </button>
      )}
    </main>
  );
}

function Question({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return <div><h4 className="text-xl sm:text-2xl font-black mb-5">{title}</h4><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{options.map(o => <button key={o} onClick={() => onChange(o)} className={`p-4 rounded-2xl border text-left font-bold transition ${value === o ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'hover:border-slate-400'}`}>{o}</button>)}</div></div>;
}
