'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function BikeDetailPage() {
  const { id } = useParams();
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBikeDetails() {
      if (!id) return;

      const { data, error } = await supabase
        .from('bikes')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setBike(data);
      }

      setLoading(false);
    }

    fetchBikeDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4F9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-semibold">
            Loading motorcycle details...
          </p>
        </div>
      </main>
    );
  }

  if (!bike) {
    return (
      <main className="min-h-screen bg-[#F4F9F6] flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-3xl border border-slate-100 shadow-xl p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-2xl mx-auto mb-5">
            🏍️
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Bike Not Found
          </h2>

          <p className="text-slate-500 text-sm mb-6">
            The motorcycle you are looking for could not be found.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const brandLogoName = bike.brand
    ? bike.brand.toLowerCase().trim()
    : '';

  return (
    <main className="min-h-screen bg-[#F4F9F6] text-slate-800 font-sans flex flex-col justify-between overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 w-full">
        {/* ================= NAVIGATION ================= */}
        <header className="flex justify-between items-center mb-8 md:mb-10">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-emerald-200 group-hover:bg-emerald-50 transition">
              ←
            </span>
            <span className="hidden sm:inline">Back to All Bikes</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo/bikefinderlogo.jpeg"
              alt="BikeFinder Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-xl border border-slate-100 shadow-sm bg-white"
            />

            <span className="text-lg md:text-xl font-black tracking-tight text-slate-900">
              BIKE<span className="text-emerald-500">FINDER</span>
            </span>
          </Link>
        </header>

        {/* ================= HERO SECTION ================= */}
        <section className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden mb-10 md:mb-14">
          {/* Hero Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Bike Image Area */}
            <div className="relative min-h-[320px] md:min-h-[440px] lg:min-h-[520px] bg-gradient-to-br from-[#F9FCFA] via-white to-emerald-50/40 flex items-center justify-center p-6 md:p-10 overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full border border-emerald-100/80" />
              <div className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border border-emerald-100/50" />

              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="bg-white/90 backdrop-blur border border-slate-100 shadow-sm text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] px-3 py-2 rounded-full">
                  Motorcycle Profile
                </span>
              </div>

              <img
                src={bike.image_url}
                alt={bike.name}
                className="relative z-10 max-h-[300px] md:max-h-[420px] lg:max-h-[460px] w-full object-contain mix-blend-multiply drop-shadow-2xl transition duration-500 hover:scale-105"
              />

              <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-[55%] h-5 bg-slate-900/10 blur-xl rounded-full" />
            </div>

            {/* Bike Information */}
            <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <img
                    src={`/logo/${brandLogoName}.png`}
                    alt={bike.brand}
                    className="h-4 object-contain max-w-[60px]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  <span className="text-emerald-700 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    {bike.brand}
                  </span>
                </div>

                <span className="bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {bike.bike_type || 'Motorcycle'}
                </span>
              </div>

              <p className="text-emerald-600 font-bold uppercase tracking-[0.18em] text-[10px] md:text-xs mb-3">
                Bike Specifications
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[0.95] tracking-tight mb-4">
                {bike.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                Model Year:{' '}
                <span className="font-semibold text-slate-600">
                  {bike.model_year || 'N/A'}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-7">
                <QuickStat
                  label="Engine"
                  value={`${bike.engine_capacity} cc`}
                />

                <QuickStat
                  label="Power"
                  value={`${bike.power_hp} HP`}
                />

                <QuickStat
                  label="Torque"
                  value={`${bike.torque_nm} Nm`}
                />

                <QuickStat
                  label="Mileage"
                  value={
                    bike.fuel_consumption_kmpl
                      ? `${bike.fuel_consumption_kmpl} km/L`
                      : 'N/A'
                  }
                  highlight
                />
              </div>

              {/* Additional Highlight */}
              <div className="flex items-center justify-between bg-[#F8FAF9] rounded-2xl border border-slate-100 px-4 py-3 mb-7">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Top Speed
                  </p>

                  <p className="font-black text-slate-800 text-lg">
                    {bike.top_speed_kmph} km/h
                  </p>
                </div>

                <div className="w-px h-9 bg-slate-200" />

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Transmission
                  </p>

                  <p className="font-bold text-slate-700 text-sm">
                    {bike.transmission || 'N/A'}
                  </p>
                </div>
              </div>

              <Link
                href="/compare"
                className="group inline-flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition duration-300 shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/20"
              >
                <span>Compare with Another Bike</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= SPECIFICATIONS HEADER ================= */}
        <section className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-flex bg-emerald-500/10 text-emerald-700 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-emerald-100 mb-3">
                Full Specification Sheet
              </span>

              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Technical Specifications
              </h2>

              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Explore the complete technical details, performance data,
                dimensions, features, and equipment of the {bike.name}.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Verified Bike Information
            </div>
          </div>
        </section>

        {/* ================= SPECIFICATION CARDS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mb-16">
          <SpecCard
            title="Engine & Transmission"
            icon="⚙️"
            description="Performance and powertrain details"
          >
            <SpecItem
              label="Displacement"
              value={`${bike.engine_capacity} cc`}
            />
            <SpecItem
              label="Cooling / Fuel System"
              value={bike.cooling_system}
            />
            <SpecItem
              label="Max Power"
              value={`${bike.power_hp} HP`}
            />
            <SpecItem
              label="Max Torque"
              value={`${bike.torque_nm} Nm`}
            />
            <SpecItem
              label="Top Speed"
              value={`${bike.top_speed_kmph} km/h`}
            />
            <SpecItem
              label="Transmission"
              value={bike.transmission}
            />
            <SpecItem
              label="Clutch"
              value={bike.clutch_type}
            />
            <SpecItem
              label="Valves per Cylinder"
              value={bike.valves_per_cylinder}
            />
          </SpecCard>

          <SpecCard
            title="Brakes, Tyres & Suspension"
            icon="🛞"
            description="Control, handling and riding hardware"
          >
            <SpecItem
              label="Front Brake"
              value={bike.front_brake}
            />
            <SpecItem
              label="Rear Brake"
              value={bike.rear_brake}
            />
            <SpecItem
              label="ABS / Braking"
              value={bike.abs}
            />
            <SpecItem
              label="Front Suspension"
              value={bike.front_suspension}
            />
            <SpecItem
              label="Rear Suspension"
              value={bike.rear_suspension}
            />
            <SpecItem
              label="Front Tyre"
              value={bike.tyre_front}
            />
            <SpecItem
              label="Rear Tyre"
              value={bike.tyre_rear}
            />
            <SpecItem
              label="Frame Type"
              value={bike.frame}
            />
          </SpecCard>

          <SpecCard
            title="Dimensions & Capacity"
            icon="📐"
            description="Size, weight and fuel information"
          >
            <SpecItem
              label="Length"
              value={bike.length_mm ? `${bike.length_mm} mm` : null}
            />
            <SpecItem
              label="Width"
              value={bike.width_mm ? `${bike.width_mm} mm` : null}
            />
            <SpecItem
              label="Height"
              value={bike.height_mm ? `${bike.height_mm} mm` : null}
            />
            <SpecItem
              label="Kerb Weight"
              value={
                bike.kerb_weight_kg
                  ? `${bike.kerb_weight_kg} kg`
                  : null
              }
            />
            <SpecItem
              label="Fuel Tank Capacity"
              value={
                bike.fuel_tank_capacity_l
                  ? `${bike.fuel_tank_capacity_l} Litres`
                  : null
              }
            />
            <SpecItem
              label="Fuel Economy (Approx.)"
              value={
                bike.fuel_consumption_kmpl
                  ? `${bike.fuel_consumption_kmpl} km/L`
                  : null
              }
            />
            <SpecItem
              label="Seat Height"
              value={
                bike.saddle_height_mm
                  ? `${bike.saddle_height_mm} mm`
                  : null
              }
            />
            <SpecItem
              label="Ground Clearance"
              value={
                bike.ground_clearance_mm
                  ? `${bike.ground_clearance_mm} mm`
                  : null
              }
            />
            <SpecItem
              label="Wheelbase"
              value={
                bike.wheelbase_mm
                  ? `${bike.wheelbase_mm} mm`
                  : null
              }
            />
          </SpecCard>

          <SpecCard
            title="Electricals & Smart Features"
            icon="⚡"
            description="Lighting, electronics and connectivity"
          >
            <SpecItem
              label="Instrument Console"
              value={bike.cluster}
            />
            <SpecItem
              label="Headlamp"
              value={bike.headlamp}
            />
            <SpecItem
              label="Tail Lamp"
              value={bike.tail_lamp}
            />
            <SpecItem
              label="Turn Signal Lamp"
              value={bike.turn_signal_lamp}
            />
            <SpecItem
              label="Battery"
              value={bike.battery}
            />
            <SpecItem
              label="Bluetooth Connectivity"
              value={bike.bluetooth_connectivity}
            />
            <SpecItem
              label="Traction Control"
              value={bike.traction_control}
            />
            <SpecItem
              label="Muffler"
              value={bike.muffler}
            />
          </SpecCard>
        </div>

        {/* ================= BOTTOM CTA ================= */}
        <section className="relative bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-8 p-8 md:p-12">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                Still Deciding?
              </span>

              <h3 className="text-2xl md:text-3xl font-black text-white mt-2">
                Compare {bike.name} with another bike
              </h3>

              <p className="text-slate-400 text-sm mt-2 max-w-lg">
                Compare performance, specifications, fuel economy and
                dimensions side-by-side.
              </p>
            </div>

            <Link
              href="/compare"
              className="inline-flex items-center justify-center whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-4 rounded-2xl transition shadow-lg shadow-emerald-500/20"
            >
              Start Comparing →
            </Link>
          </div>
        </section>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200/60 py-7 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-xs text-slate-500 gap-2 text-center">
          <p>© 2026 BikeFinder. All rights reserved.</p>

          <p className="flex items-center gap-1 font-medium">
            Developed with{' '}
            <span className="text-emerald-500">♥</span>{' '}
            by{' '}
            <span className="font-bold text-slate-800">
              Dishen
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================
   QUICK STAT
============================================================ */

function QuickStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#F8FAF9] border border-slate-100 rounded-xl md:rounded-2xl p-3 text-center hover:border-emerald-100 hover:bg-emerald-50/30 transition">
      <p className="text-[9px] md:text-[10px] uppercase tracking-wide text-slate-400 font-bold mb-1">
        {label}
      </p>

      <p
        className={`text-xs md:text-sm font-black ${
          highlight
            ? 'text-emerald-600'
            : 'text-slate-800'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   SPECIFICATION CARD
============================================================ */

function SpecCard({
  title,
  icon,
  description,
  children,
}: {
  title: string;
  icon: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-200/30 hover:shadow-xl hover:shadow-slate-200/40 transition duration-300 overflow-hidden">
      <div className="p-6 md:p-7 border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/30">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg">
            {icon}
          </div>

          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900">
              {title}
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   SPECIFICATION ITEM
============================================================ */

function SpecItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const displayValue =
    value !== null &&
    value !== undefined &&
    value !== ''
      ? value
      : '-';

  return (
    <div className="flex justify-between items-center gap-5 px-6 md:px-7 py-4 hover:bg-[#F8FAF9] transition">
      <span className="text-xs md:text-sm text-slate-500 font-medium">
        {label}
      </span>

      <span className="text-xs md:text-sm text-slate-900 font-bold text-right max-w-[55%] break-words">
        {displayValue}
      </span>
    </div>
  );
}