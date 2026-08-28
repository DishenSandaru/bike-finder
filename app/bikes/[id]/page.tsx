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
      <div className="min-h-screen bg-[#F4F9F6] flex items-center justify-center text-slate-500 font-medium">
        Loading Specifications...
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-[#F4F9F6] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Bike Not Found</h2>
        <Link href="/" className="bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold">
          Back to Home
        </Link>
      </div>
    );
  }

  const brandLogoName = bike.brand ? bike.brand.toLowerCase().trim() : '';

  return (
    <main className="min-h-screen bg-[#F4F9F6] text-slate-800 font-sans flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
        {/* Navigation Bar with Logo */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 font-bold transition text-sm">
            ← Back to All Bikes
          </Link>
          <div className="flex items-center gap-2">
            <img
              src="/logo/bikefinderlogo.jpeg"
              alt="BikeFinder Logo"
              className="w-14 h-14 object-contain rounded-lg shadow-sm border border-slate-100"
            />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              BIKE<span className="text-emerald-500">FINDER</span>
            </span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl mb-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="w-full h-72 md:h-96 bg-white rounded-2xl flex items-center justify-center p-6 relative overflow-hidden border border-slate-100/80">
            <img
              src={bike.image_url}
              alt={bike.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xl hover:scale-105 transition duration-300"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <img
                  src={`/logo/${brandLogoName}.png`}
                  alt={bike.brand}
                  className="h-4 object-contain max-w-[60px]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-emerald-700 text-xs font-bold uppercase">
                  {bike.brand}
                </span>
              </div>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                {bike.bike_type || 'Motorcycle'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 leading-tight">
              {bike.name}
            </h1>
            <p className="text-slate-400 text-sm mb-6">Model Year: {bike.model_year || 'N/A'}</p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2 mb-8 bg-[#F8FAF9] p-4 rounded-2xl border border-slate-100 text-center">
              <div>
                <p className="text-xs text-slate-400 font-medium">Capacity</p>
                <p className="font-extrabold text-slate-800 text-sm">{bike.engine_capacity} cc</p>
              </div>
              <div className="border-l border-slate-200">
                <p className="text-xs text-slate-400 font-medium">Power</p>
                <p className="font-extrabold text-slate-800 text-sm">{bike.power_hp} HP</p>
              </div>
              <div className="border-l border-slate-200">
                <p className="text-xs text-slate-400 font-medium">Torque</p>
                <p className="font-extrabold text-slate-800 text-sm">{bike.torque_nm} Nm</p>
              </div>
              <div className="border-l border-slate-200">
                <p className="text-xs text-slate-400 font-medium">Mileage</p>
                <p className="font-extrabold text-emerald-600 text-sm">
                  {bike.fuel_consumption_kmpl ? `${bike.fuel_consumption_kmpl} km/L` : 'N/A'}
                </p>
              </div>
            </div>

            <Link
              href="/compare"
              className="inline-block w-full text-center bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-full transition shadow-md text-sm"
            >
              Compare with Another Bike →
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-6">Technical Specifications</h2>

        {/* Detailed Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <SpecCard title="Engine & Transmission">
            <SpecItem label="Displacement" value={`${bike.engine_capacity} cc`} />
            <SpecItem label="Cooling / Fuel System" value={bike.cooling_system} />
            <SpecItem label="Max Power" value={`${bike.power_hp} HP`} />
            <SpecItem label="Max Torque" value={`${bike.torque_nm} Nm`} />
            <SpecItem label="Top Speed" value={`${bike.top_speed_kmph} km/h`} />
            <SpecItem label="Transmission" value={bike.transmission} />
            <SpecItem label="Clutch" value={bike.clutch_type} />
            <SpecItem label="Valves per Cylinder" value={bike.valves_per_cylinder} />
          </SpecCard>

          <SpecCard title="Brakes, Tyres & Suspension">
            <SpecItem label="Front Brake" value={bike.front_brake} />
            <SpecItem label="Rear Brake" value={bike.rear_brake} />
            <SpecItem label="ABS / Braking" value={bike.abs} />
            <SpecItem label="Front Suspension" value={bike.front_suspension} />
            <SpecItem label="Rear Suspension" value={bike.rear_suspension} />
            <SpecItem label="Front Tyre" value={bike.tyre_front} />
            <SpecItem label="Rear Tyre" value={bike.tyre_rear} />
            <SpecItem label="Frame Type" value={bike.frame} />
          </SpecCard>

          <SpecCard title="Dimensions & Capacity">
            <SpecItem label="Kerb Weight" value={bike.kerb_weight_kg ? `${bike.kerb_weight_kg} kg` : null} />
            <SpecItem label="Fuel Tank Capacity" value={bike.fuel_tank_capacity_l ? `${bike.fuel_tank_capacity_l} Litres` : null} />
            <SpecItem label="Fuel Economy (Approx.)" value={bike.fuel_consumption_kmpl ? `${bike.fuel_consumption_kmpl} km/L` : null} />
            <SpecItem label="Seat Height" value={bike.saddle_height_mm ? `${bike.saddle_height_mm} mm` : null} />
            <SpecItem label="Ground Clearance" value={bike.ground_clearance_mm ? `${bike.ground_clearance_mm} mm` : null} />
            <SpecItem label="Wheelbase" value={bike.wheelbase_mm ? `${bike.wheelbase_mm} mm` : null} />
          </SpecCard>

          <SpecCard title="Electricals & Smart Features">
            <SpecItem label="Instrument Console" value={bike.cluster} />
            <SpecItem label="Headlamp" value={bike.headlamp} />
            <SpecItem label="Tail Lamp" value={bike.tail_lamp} />
            <SpecItem label="Bluetooth Connectivity" value={bike.bluetooth_connectivity} />
            <SpecItem label="Traction Control" value={bike.traction_control} />
          </SpecCard>
        </div>
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

function SpecCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md">
      <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="text-slate-800 font-semibold text-right">{value || '-'}</span>
    </div>
  );
}