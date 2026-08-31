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
  cooling_system?: string;
  power_hp: number;
  torque_nm?: number;
  top_speed_kmph?: number;
  transmission?: string;
  clutch_type?: string;
  front_suspension?: string;
  rear_suspension?: string;
  front_brake?: string;
  rear_brake?: string;
  tyre_front?: string;
  tyre_rear?: string;
  abs?: string;
  cluster?: string;
  traction_control?: string;
  bluetooth_connectivity?: string;
  saddle_height_mm?: number;
  ground_clearance_mm?: number;
  kerb_weight_kg?: number;
  fuel_tank_capacity_l?: number;
  fuel_consumption_kmpl?: string | number;
  frame?: string;
  image_url: string;
}

export default function ComparePage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [bike1Id, setBike1Id] = useState('');
  const [bike2Id, setBike2Id] = useState('');

  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');

  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);

  const [mobile, setMobile] = useState(false);

  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBikes() {
      const { data, error } = await supabase
        .from('bikes')
        .select('*');

      if (error) {
        console.error('Error loading bikes:', error);
        return;
      }

      if (data && data.length > 0) {
        const loadedBikes = data as Bike[];

        setBikes(loadedBikes);

        const params = new URLSearchParams(window.location.search);

        const requestedBike1 = params.get('bike1');
        const requestedBike2 = params.get('bike2');

        setBike1Id(
          requestedBike1 && loadedBikes.some(b => b.id === requestedBike1)
            ? requestedBike1
            : loadedBikes[0].id
        );

        setBike2Id(
          requestedBike2 && loadedBikes.some(b => b.id === requestedBike2)
            ? requestedBike2
            : loadedBikes[Math.min(1, loadedBikes.length - 1)].id
        );
      }
    }

    fetchBikes();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        r1.current &&
        !r1.current.contains(target)
      ) {
        setS1(false);
      }

      if (
        r2.current &&
        !r2.current.contains(target)
      ) {
        setS2(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const b1 = bikes.find(b => b.id === bike1Id);
  const b2 = bikes.find(b => b.id === bike2Id);

  const sug1 = bikes
    .filter(
      b =>
        q1 &&
        `${b.brand} ${b.name}`
          .toLowerCase()
          .includes(q1.toLowerCase())
    )
    .slice(0, 7);

  const sug2 = bikes
    .filter(
      b =>
        q2 &&
        `${b.brand} ${b.name}`
          .toLowerCase()
          .includes(q2.toLowerCase())
    )
    .slice(0, 7);

  const metrics = useMemo(() => {
    if (!b1 || !b2) return [];

    return [
      ['Power', 'power_hp', 'HP', 'higher'],
      ['Torque', 'torque_nm', 'Nm', 'higher'],
      ['Top Speed', 'top_speed_kmph', 'km/h', 'higher'],
      ['Engine', 'engine_capacity', 'cc', 'higher'],
      ['Fuel Economy', 'fuel_consumption_kmpl', 'km/L', 'higher'],
      ['Weight', 'kerb_weight_kg', 'kg', 'lower'],
      ['Seat Height', 'saddle_height_mm', 'mm', 'lower'],
      ['Ground Clearance', 'ground_clearance_mm', 'mm', 'higher'],
    ] as const;
  }, [b1, b2]);

  const winners = useMemo(() => {
    if (!b1 || !b2) return null;

    return {
      power: winner(b1.power_hp, b2.power_hp),
      torque: winner(b1.torque_nm, b2.torque_nm),
      speed: winner(b1.top_speed_kmph, b2.top_speed_kmph),
      economy: winner(
        num(b1.fuel_consumption_kmpl),
        num(b2.fuel_consumption_kmpl)
      ),
      weight: winner(
        b1.kerb_weight_kg,
        b2.kerb_weight_kg,
        true
      ),
      safety: [safety(b1), safety(b2)],
    };
  }, [b1, b2]);

  const scroll = () => {
    document
      .getElementById('analysis')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900 overflow-x-hidden">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <img
                src="https://ohazkgtidtbzbdtzaqnl.supabase.co/storage/v1/object/public/bikes/logos/bikefinderlogo.jpeg"
                alt="BikeFinder"
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />

              <div>
                <p className="text-xl sm:text-2xl font-black">
                  BIKE
                  <span className="text-emerald-500">
                    FINDER
                  </span>
                </p>

                <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                  DISCOVER. COMPARE. RIDE.
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex gap-8 text-sm font-semibold text-slate-500">
              <Link
                href="/"
                className="hover:text-emerald-600 transition"
              >
                Explore Bikes
              </Link>

              <button
                onClick={scroll}
                className="hover:text-emerald-600 transition"
              >
                Compare Specs
              </button>
            </nav>

            <div className="hidden sm:flex">
              <Link
                href="/"
                className="bg-slate-950 text-white px-5 py-3 rounded-full text-sm font-bold hover:bg-emerald-600 transition"
              >
                Back to Home ←
              </Link>
            </div>

            <button
              onClick={() => setMobile(v => !v)}
              className="lg:hidden w-11 h-11 rounded-xl bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobile ? '✕' : '☰'}
            </button>

          </div>

          {mobile && (
            <div className="lg:hidden py-4 border-t">
              <Link
                href="/"
                className="font-bold"
              >
                Back to Home
              </Link>
            </div>
          )}

        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 sm:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            SIDE-BY-SIDE MOTORCYCLE COMPARISON
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-7">
            Compare Bikes.
            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-500">
              See the Difference.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-5 text-slate-500 leading-8">
            Compare performance, safety, dimensions and technical
            specifications without relying on location-specific pricing.
          </p>

        </div>
      </section>

      {/* Selectors */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-6">

            <Selector
              title="Motorcycle One"
              bike={b1}
              bikes={bikes}
              value={bike1Id}
              setValue={setBike1Id}
              query={q1}
              setQuery={setQ1}
              show={s1}
              setShow={setS1}
              suggestions={sug1}
              refEl={r1}
              accent="emerald"
            />

            <Selector
              title="Motorcycle Two"
              bike={b2}
              bikes={bikes}
              value={bike2Id}
              setValue={setBike2Id}
              query={q2}
              setQuery={setQ2}
              show={s2}
              setShow={setS2}
              suggestions={sug2}
              refEl={r2}
              accent="cyan"
            />

          </div>

        </div>
      </section>

      {/* Comparison */}
      {b1 && b2 && (
        <>
          {/* Quick Verdict */}
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              <div className="bg-slate-950 text-white rounded-[2rem] p-7 md:p-10">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                  <div>
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                      Quick Verdict
                    </p>

                    <h2 className="text-3xl md:text-4xl font-black mt-2">
                      Which one leads?
                    </h2>

                    <p className="text-slate-400 text-sm mt-2">
                      Category winners are calculated from the displayed
                      technical data.
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold">
                      Safety
                    </p>

                    <p className="font-black text-xl">
                      {(winners?.safety[0] ?? 0) === (winners?.safety[1] ?? 0)
                        ? 'Tie'
                        : (winners?.safety[0] ?? 0) > (winners?.safety[1] ?? 0)
                          ? b1.name
                          : b2.name}
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">

                  {[
                    ['Power', winners?.power],
                    ['Torque', winners?.torque],
                    ['Top Speed', winners?.speed],
                    ['Economy', winners?.economy],
                    ['Weight', winners?.weight],
                  ].map(([label, w]) => (
                    <div
                      key={label as string}
                      className="bg-white/5 rounded-2xl p-4"
                    >
                      <p className="text-xs text-slate-400">
                        {label}
                      </p>

                      <p className="font-black mt-2">
                        {w === 0
                          ? 'Tie'
                          : w === 1
                            ? b1.name
                            : w === 2
                              ? b2.name
                              : '-'}
                      </p>
                    </div>
                  ))}

                </div>

              </div>

            </div>
          </section>

          {/* Detailed Analysis */}
          <section
            id="analysis"
            className="py-16 bg-white/60 border-y scroll-mt-24"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              <div className="text-center mb-10">

                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                  Detailed Analysis
                </span>

                <h2 className="text-4xl font-black mt-3">
                  Technical Comparison
                </h2>

                <p className="text-slate-500 mt-3">
                  Higher is better for performance metrics; lower is better
                  for weight and seat height.
                </p>

              </div>

              <div className="bg-white border rounded-[2rem] overflow-hidden shadow-xl">

                {/* Table Header */}
                <div className="grid grid-cols-3 bg-slate-950 text-white p-5 sm:p-7">

                  <div className="font-black text-xs sm:text-sm uppercase text-slate-400">
                    Specification
                  </div>

                  <div className="text-center font-black truncate">
                    {b1.name}
                  </div>

                  <div className="text-center font-black truncate">
                    {b2.name}
                  </div>

                </div>

                {/* Main Metrics */}
                {metrics.map(
                  ([label, key, unit, dir]) => (
                    <CompareRow
                      key={label}
                      label={label}
                      v1={b1[key as keyof Bike]}
                      v2={b2[key as keyof Bike]}
                      unit={unit}
                      direction={dir}
                    />
                  )
                )}

                {/* General */}
                <RowSection title="General Information" />

                <CompareRow
                  label="Brand"
                  v1={b1.brand}
                  v2={b2.brand}
                />

                <CompareRow
                  label="Category"
                  v1={b1.bike_type}
                  v2={b2.bike_type}
                />

                <CompareRow
                  label="Model Year"
                  v1={b1.model_year}
                  v2={b2.model_year}
                />

                {/* Engine */}
                <RowSection title="Engine & Transmission" />

                <CompareRow
                  label="Cooling / Fuel System"
                  v1={b1.cooling_system}
                  v2={b2.cooling_system}
                />

                <CompareRow
                  label="Transmission"
                  v1={b1.transmission}
                  v2={b2.transmission}
                />

                <CompareRow
                  label="Clutch"
                  v1={b1.clutch_type}
                  v2={b2.clutch_type}
                />

                {/* Brakes */}
                <RowSection title="Brakes, Tyres & Suspension" />

                <CompareRow
                  label="Front Brake"
                  v1={b1.front_brake}
                  v2={b2.front_brake}
                />

                <CompareRow
                  label="Rear Brake"
                  v1={b1.rear_brake}
                  v2={b2.rear_brake}
                />

                <CompareRow
                  label="ABS"
                  v1={b1.abs}
                  v2={b2.abs}
                />

                <CompareRow
                  label="Front Suspension"
                  v1={b1.front_suspension}
                  v2={b2.front_suspension}
                />

                <CompareRow
                  label="Rear Suspension"
                  v1={b1.rear_suspension}
                  v2={b2.rear_suspension}
                />

                <CompareRow
                  label="Frame"
                  v1={b1.frame}
                  v2={b2.frame}
                />

                <CompareRow
                  label="Front Tyre"
                  v1={b1.tyre_front}
                  v2={b2.tyre_front}
                />

                <CompareRow
                  label="Rear Tyre"
                  v1={b1.tyre_rear}
                  v2={b2.tyre_rear}
                />

                {/* Features */}
                <RowSection title="Features" />

                <CompareRow
                  label="Instrument Cluster"
                  v1={b1.cluster}
                  v2={b2.cluster}
                />

                <CompareRow
                  label="Traction Control"
                  v1={b1.traction_control}
                  v2={b2.traction_control}
                />

                <CompareRow
                  label="Bluetooth"
                  v1={b1.bluetooth_connectivity}
                  v2={b2.bluetooth_connectivity}
                />

                <CompareRow
                  label="Fuel Tank"
                  v1={b1.fuel_tank_capacity_l}
                  v2={b2.fuel_tank_capacity_l}
                  unit="L"
                  direction="higher"
                />

              </div>

            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10 text-center text-xs text-slate-500">
          <div className="flex flex-col items-center justify-center gap-2">
            <p>© {new Date().getFullYear()} BikeFinder.</p>

            <p className="flex items-center gap-1">
              Developed with{' '}
              <span className="text-emerald-400">♥</span>
              {' '}by{' '}
              <b className="text-slate-300">Dishen</b>
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}

/* =========================================================
   SELECTOR
========================================================= */

function Selector({
  title,
  bike,
  bikes,
  value,
  setValue,
  query,
  setQuery,
  show,
  setShow,
  suggestions,
  refEl,
  accent,
}: {
  title: string;
  bike?: Bike;
  bikes: Bike[];
  value: string;
  setValue: (v: string) => void;
  query: string;
  setQuery: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
  suggestions: Bike[];
  refEl: React.RefObject<HTMLDivElement | null>;
  accent: 'emerald' | 'cyan';
}) {
  return (
    <div className="bg-white border rounded-[2rem] p-5 sm:p-7 shadow-xl relative overflow-visible">

      <div
        className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${accent === 'emerald'
          ? 'from-emerald-400 to-cyan-400'
          : 'from-cyan-400 to-emerald-400'
          }`}
      />

      <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">
        {title}
      </p>

      <h2 className="text-2xl font-black mt-2">
        Choose a motorcycle
      </h2>

      {/* Search */}
      <div
        ref={refEl}
        className="relative mt-6"
      >

        <input
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setShow(true);
          }}
          onFocus={() => setShow(true)}
          placeholder="Search motorcycle or brand..."
          className="w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-emerald-500"
        />

        {show && suggestions.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white border rounded-2xl shadow-2xl overflow-hidden">

            {suggestions.map(b => (
              <button
                key={b.id}
                onClick={() => {
                  setValue(b.id);
                  setQuery('');
                  setShow(false);
                }}
                className="w-full p-4 text-left hover:bg-emerald-50 border-b last:border-0 transition"
              >

                <b>{b.name}</b>

                <span className="block text-xs text-slate-400 mt-1">
                  {b.brand} • {b.engine_capacity} cc
                </span>

              </button>
            ))}

          </div>
        )}

      </div>

      {/* Select */}
      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full mt-3 bg-slate-50 border rounded-2xl px-5 py-4 font-bold outline-none focus:border-emerald-500"
      >

        {bikes.map(b => (
          <option
            key={b.id}
            value={b.id}
          >
            {b.name} ({b.brand})
          </option>
        ))}

      </select>

      {/* Selected Bike */}
      {bike && (
        <>
          <div className="h-64 sm:h-72 mt-6 bg-slate-50 rounded-3xl flex items-center justify-center overflow-hidden">

            {bike.image_url ? (
              <img
                src={bike.image_url}
                alt={bike.name}
                className="max-w-[90%] max-h-[85%] object-contain drop-shadow-2xl"
              />
            ) : (
              <span className="text-6xl opacity-20">
                🏍️
              </span>
            )}

          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            <img
              src={`https://ohazkgtidtbzbdtzaqnl.supabase.co/storage/v1/object/public/bikes/logos/${bike.brand.toLowerCase()}.png`}
              alt={bike.brand}
              className="w-5 h-5 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              {bike.brand}
            </p>
          </div>

          <h3 className="text-2xl font-black text-center mt-2">
            {bike.name}
          </h3>

          <div className="grid grid-cols-3 gap-2 mt-5">

            <Mini
              label="Engine"
              value={`${bike.engine_capacity} cc`}
            />

            <Mini
              label="Power"
              value={`${bike.power_hp} HP`}
            />

            <Mini
              label="Torque"
              value={`${bike.torque_nm ?? '-'} Nm`}
            />

          </div>
        </>
      )}

    </div>
  );
}

/* =========================================================
   MINI SPEC
========================================================= */

function Mini({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 border rounded-xl p-3 text-center">

      <p className="text-[9px] text-slate-400 font-bold uppercase">
        {label}
      </p>

      <p className="font-black text-sm mt-1">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   NUMBER PARSER
========================================================= */

function num(v: unknown): number {
  const n = parseFloat(
    String(v ?? '').replace(/[^\d.]/g, '')
  );

  return Number.isFinite(n) ? n : 0;
}

/* =========================================================
   WINNER CALCULATOR
========================================================= */

function winner(
  a: number | undefined,
  b: number | undefined,
  lower = false
): number {
  const av = Number(a ?? 0);
  const bv = Number(b ?? 0);

  if (av === 0 && bv === 0) {
    return 0;
  }

  if (av === bv) {
    return 0;
  }

  if (lower) {
    return av < bv ? 1 : 2;
  }

  return av > bv ? 1 : 2;
}

/* =========================================================
   SAFETY SCORE
========================================================= */

function safety(b: Bike): number {
  let score = 0;

  if (
    /yes|dual|single|standard|equipped/i.test(
      String(b.abs ?? '')
    )
  ) {
    score += 2;
  }

  if (
    /yes|standard|available|equipped/i.test(
      String(b.traction_control ?? '')
    )
  ) {
    score += 1;
  }

  return score;
}

/* =========================================================
   COMPARISON ROW
========================================================= */

function CompareRow({
  label,
  v1,
  v2,
  unit,
  direction,
}: {
  label: string;
  v1: unknown;
  v2: unknown;
  unit?: string;
  direction?: string;
}) {
  const a = num(v1);
  const b = num(v2);

  const numeric =
    !!direction &&
    Number.isFinite(a) &&
    Number.isFinite(b) &&
    a !== 0 &&
    b !== 0;

  let w = 0;

  if (numeric) {
    w = winner(
      a,
      b,
      direction === 'lower'
    );
  }

  const display1 =
    v1 !== undefined &&
      v1 !== null &&
      v1 !== ''
      ? `${v1}${unit ? ` ${unit}` : ''}`
      : '-';

  const display2 =
    v2 !== undefined &&
      v2 !== null &&
      v2 !== ''
      ? `${v2}${unit ? ` ${unit}` : ''}`
      : '-';

  return (
    <div className="grid grid-cols-3 px-4 sm:px-8 py-4 border-t hover:bg-emerald-50/40 transition">

      <div className="text-xs sm:text-sm text-slate-500 font-bold pr-3">
        {label}
      </div>

      <div
        className={`text-xs sm:text-sm font-bold pr-3 ${w === 1
          ? 'text-emerald-600'
          : ''
          }`}
      >
        {display1}

        {w === 1 && (
          <span className="ml-2 text-[9px] uppercase">
            Best
          </span>
        )}
      </div>

      <div
        className={`text-xs sm:text-sm font-bold border-l pl-3 ${w === 2
          ? 'text-emerald-600'
          : ''
          }`}
      >
        {display2}

        {w === 2 && (
          <span className="ml-2 text-[9px] uppercase">
            Best
          </span>
        )}
      </div>

    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function RowSection({
  title,
}: {
  title: string;
}) {
  return (
    <div className="bg-slate-950 px-4 sm:px-8 py-4">

      <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-widest">
        {title}
      </span>

    </div>
  );
}