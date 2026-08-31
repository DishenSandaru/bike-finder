'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Bike {
  id: string; name: string; brand: string; bike_type?: string; model_year?: string;
  engine_capacity: number; cooling_system?: string; power_hp: number; torque_nm: number;
  top_speed_kmph: number; transmission?: string; clutch_type?: string; valves_per_cylinder?: string;
  muffler?: string; frame?: string; front_suspension?: string; rear_suspension?: string;
  front_brake?: string; rear_brake?: string; tyre_front?: string; tyre_rear?: string; abs?: string;
  battery?: string; headlamp?: string; tail_lamp?: string; turn_signal_lamp?: string; cluster?: string;
  traction_control?: string; bluetooth_connectivity?: string; length_mm?: number; width_mm?: number;
  height_mm?: number; saddle_height_mm?: number; wheelbase_mm?: number; ground_clearance_mm?: number;
  kerb_weight_kg?: number; fuel_tank_capacity_l?: number; fuel_consumption_kmpl?: string | number; image_url: string;
}

export default function BikeDetailPage() {
  const { id } = useParams();
  const [bike, setBike] = useState<Bike | null>(null);
  const [allBikes, setAllBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const [{ data: current }, { data: all }] = await Promise.all([
        supabase.from('bikes').select('*').eq('id', id).single(),
        supabase.from('bikes').select('*'),
      ]);
      setBike(current || null);
      setAllBikes(all || []);
      setLoading(false);
    }
    load();
    try { const savedIds = JSON.parse(localStorage.getItem('bikefinder_favorites') || '[]'); setSaved(savedIds.includes(id)); } catch {}
  }, [id]);

  const toggleSave = () => {
    if (!bike) return;
    let ids: string[] = [];
    try { ids = JSON.parse(localStorage.getItem('bikefinder_favorites') || '[]'); } catch {}
    ids = ids.includes(bike.id) ? ids.filter(x => x !== bike.id) : [...ids, bike.id];
    localStorage.setItem('bikefinder_favorites', JSON.stringify(ids));
    setSaved(ids.includes(bike.id));
  };

  const score = useMemo(() => bike ? calculateScore(bike) : 0, [bike]);
  const strengths = useMemo(() => bike ? getStrengths(bike) : [], [bike]);
  const considerations = useMemo(() => bike ? getConsiderations(bike) : [], [bike]);

  const similar = useMemo(() => {
    if (!bike) return [];
    const similarity = (b: Bike) => {
      if (b.id === bike.id) return -1;
      const a = Math.abs((b.engine_capacity || 0) - (bike.engine_capacity || 0)) / Math.max(bike.engine_capacity || 1, 1);
      const p = Math.abs((b.power_hp || 0) - (bike.power_hp || 0)) / Math.max(bike.power_hp || 1, 1);
      const t = b.bike_type && bike.bike_type && b.bike_type === bike.bike_type ? 0 : 0.25;
      return Math.max(0, Math.round((1 - Math.min(1, a * .45 + p * .35 + t * .20)) * 100));
    };
    return allBikes.map(b => ({ b, s: similarity(b) })).sort((x,y) => y.s-x.s).slice(0, 3);
  }, [bike, allBikes]);

  if (loading) return <main className="min-h-screen bg-[#f7f9f8] flex items-center justify-center"><div className="text-center"><div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" /><p className="text-slate-500 font-semibold">Loading motorcycle details...</p></div></main>;
  if (!bike) return <main className="min-h-screen bg-[#f7f9f8] flex items-center justify-center"><div className="bg-white rounded-3xl p-10 text-center border"><h2 className="text-2xl font-black">Bike Not Found</h2><Link href="/" className="inline-block mt-6 bg-slate-950 text-white px-6 py-3 rounded-xl font-bold">← Back Home</Link></div></main>;

  return <main className="min-h-screen bg-[#f7f9f8] text-slate-900">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600"><span className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">←</span><span className="hidden sm:inline">Back to All Bikes</span></Link>
        <Link href="/" className="flex items-center gap-2"><img src="/logo/bikefinderlogo.jpeg" alt="BikeFinder" className="w-11 h-11 rounded-xl object-cover border" /><span className="text-lg font-black">BIKE<span className="text-emerald-500">FINDER</span></span></Link>
      </header>

      <section className="bg-white rounded-[2rem] border shadow-xl overflow-hidden mb-10">
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="min-h-[330px] md:min-h-[500px] bg-gradient-to-br from-[#f9fcfa] via-white to-emerald-50/40 flex items-center justify-center p-6 relative">
            <span className="absolute top-6 left-6 bg-white/90 border rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Motorcycle Profile</span>
            <img src={bike.image_url} alt={bike.name} className="max-h-[420px] max-w-[92%] object-contain mix-blend-multiply drop-shadow-2xl hover:scale-105 transition" />
          </div>
          <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5">
                <img 
                  src={`https://ohazkgtidtbzbdtzaqnl.supabase.co/storage/v1/object/public/bikes/logos/${bike.brand.toLowerCase()}.png`} 
                  alt={bike.brand} 
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {bike.brand}
              </span>
              <span className="bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold uppercase">{bike.bike_type || 'Motorcycle'}</span>
            </div>
            <p className="text-emerald-600 text-xs font-black uppercase tracking-widest">Bike Specifications</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mt-3">{bike.name}</h1>
            <p className="text-sm text-slate-400 mt-3">Model Year: <b className="text-slate-600">{bike.model_year || 'N/A'}</b></p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mt-7">
              <QuickStat label="Engine" value={`${bike.engine_capacity} cc`} />
              <QuickStat label="Power" value={`${bike.power_hp} HP`} />
              <QuickStat label="Torque" value={`${bike.torque_nm} Nm`} />
              <QuickStat label="Mileage" value={bike.fuel_consumption_kmpl ? `${bike.fuel_consumption_kmpl} km/L` : 'N/A'} highlight />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-50 border rounded-2xl p-4"><p className="text-[10px] uppercase font-bold text-slate-400">Top Speed</p><p className="font-black text-lg mt-1">{bike.top_speed_kmph} km/h</p></div>
              <div className="bg-slate-50 border rounded-2xl p-4"><p className="text-[10px] uppercase font-bold text-slate-400">Transmission</p><p className="font-black text-sm mt-2">{bike.transmission || 'N/A'}</p></div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={toggleSave} className={`flex-1 py-4 rounded-2xl font-bold border ${saved ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white hover:bg-slate-50'}`}>{saved ? '♥ Saved' : '♡ Save Bike'}</button>
              <Link href={`/compare?bike1=${bike.id}`} className="flex-1 text-center bg-slate-950 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold">Compare →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[1.4fr_.6fr] gap-6 mb-10">
        <div className="bg-slate-950 text-white rounded-[2rem] p-7 md:p-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div><p className="text-xs font-black text-emerald-400 uppercase tracking-widest">BikeFinder Score</p><h2 className="text-3xl md:text-4xl font-black mt-2">Overall Rating</h2><p className="text-slate-400 text-sm mt-2">A transparent score based only on technical data available for this bike.</p></div>
            <div className="w-28 h-28 rounded-full border-8 border-emerald-500/30 flex items-center justify-center"><span className="text-4xl font-black">{score}<small className="text-base text-slate-400">/10</small></span></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">{[['Performance', performanceScore(bike)],['Safety', safetyScore(bike)],['Practicality', practicalityScore(bike)],['Features', featureScore(bike)]].map(([n,v]) => <div key={n as string} className="bg-white/5 rounded-2xl p-4"><p className="text-xs text-slate-400">{n}</p><p className="text-2xl font-black mt-1">{v}<small className="text-xs text-slate-500">/10</small></p><div className="h-1.5 bg-white/10 rounded-full mt-3"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${Number(v)*10}%`}} /></div></div>)}</div>
        </div>
        <div className="bg-white border rounded-[2rem] p-7"><p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Quick Take</p><h3 className="text-2xl font-black mt-2">At a glance</h3><div className="mt-5 space-y-3">{strengths.slice(0,3).map(x => <p key={x} className="text-sm font-semibold"><span className="text-emerald-500 mr-2">✓</span>{x}</p>)}</div></div>
      </section>

      <section className="grid lg:grid-cols-2 gap-5 md:gap-6 mb-12">
        <SpecCard title="Engine & Transmission" icon="⚙️" description="Performance and powertrain details"><SpecItem label="Displacement" value={`${bike.engine_capacity} cc`} /><SpecItem label="Cooling / Fuel System" value={bike.cooling_system}/><SpecItem label="Max Power" value={`${bike.power_hp} HP`}/><SpecItem label="Max Torque" value={`${bike.torque_nm} Nm`}/><SpecItem label="Top Speed" value={`${bike.top_speed_kmph} km/h`}/><SpecItem label="Transmission" value={bike.transmission}/><SpecItem label="Clutch" value={bike.clutch_type}/><SpecItem label="Valves per Cylinder" value={bike.valves_per_cylinder}/></SpecCard>
        <SpecCard title="Brakes, Tyres & Suspension" icon="🛞" description="Control, handling and riding hardware"><SpecItem label="Front Brake" value={bike.front_brake}/><SpecItem label="Rear Brake" value={bike.rear_brake}/><SpecItem label="ABS / Braking" value={bike.abs}/><SpecItem label="Front Suspension" value={bike.front_suspension}/><SpecItem label="Rear Suspension" value={bike.rear_suspension}/><SpecItem label="Front Tyre" value={bike.tyre_front}/><SpecItem label="Rear Tyre" value={bike.tyre_rear}/><SpecItem label="Frame Type" value={bike.frame}/></SpecCard>
        <SpecCard title="Dimensions & Capacity" icon="📐" description="Size, weight and fuel information"><SpecItem label="Length" value={fmt(bike.length_mm,'mm')}/><SpecItem label="Width" value={fmt(bike.width_mm,'mm')}/><SpecItem label="Height" value={fmt(bike.height_mm,'mm')}/><SpecItem label="Kerb Weight" value={fmt(bike.kerb_weight_kg,'kg')}/><SpecItem label="Fuel Tank Capacity" value={fmt(bike.fuel_tank_capacity_l,'L')}/><SpecItem label="Fuel Economy" value={fmt(bike.fuel_consumption_kmpl,'km/L')}/><SpecItem label="Seat Height" value={fmt(bike.saddle_height_mm,'mm')}/><SpecItem label="Ground Clearance" value={fmt(bike.ground_clearance_mm,'mm')}/><SpecItem label="Wheelbase" value={fmt(bike.wheelbase_mm,'mm')}/></SpecCard>
        <SpecCard title="Electricals & Smart Features" icon="⚡" description="Lighting, electronics and connectivity"><SpecItem label="Instrument Console" value={bike.cluster}/><SpecItem label="Headlamp" value={bike.headlamp}/><SpecItem label="Tail Lamp" value={bike.tail_lamp}/><SpecItem label="Turn Signal Lamp" value={bike.turn_signal_lamp}/><SpecItem label="Battery" value={bike.battery}/><SpecItem label="Bluetooth Connectivity" value={bike.bluetooth_connectivity}/><SpecItem label="Traction Control" value={bike.traction_control}/><SpecItem label="Muffler" value={bike.muffler}/></SpecCard>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border rounded-[2rem] p-7"><p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Strengths</p><h2 className="text-2xl font-black mt-2">What stands out</h2><div className="mt-5 space-y-3">{strengths.map(x => <div key={x} className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-sm font-semibold"><span className="text-emerald-600 mr-2">✓</span>{x}</div>)}</div></div>
        <div className="bg-white border rounded-[2rem] p-7"><p className="text-xs font-black text-slate-500 uppercase tracking-widest">Considerations</p><h2 className="text-2xl font-black mt-2">Things to know</h2><div className="mt-5 space-y-3">{considerations.map(x => <div key={x} className="p-4 bg-slate-50 border rounded-2xl text-sm font-semibold"><span className="text-slate-400 mr-2">•</span>{x}</div>)}</div></div>
      </section>

      <section className="mb-12"><div className="flex items-end justify-between mb-6"><div><p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Smart Matching</p><h2 className="text-3xl md:text-4xl font-black mt-2">Similar Bikes</h2></div><Link href="/" className="text-sm font-bold text-emerald-700">Explore all →</Link></div><div className="grid md:grid-cols-3 gap-5">{similar.map(({b,s}) => <Link key={b.id} href={`/bikes/${b.id}`} className="bg-white border rounded-3xl p-4 hover:-translate-y-1 hover:shadow-xl transition"><div className="h-44 bg-slate-50 rounded-2xl flex items-center justify-center"><img src={b.image_url} alt={b.name} className="max-w-[90%] max-h-[85%] object-contain"/></div><div className="p-2"><p className="text-[10px] font-black text-emerald-600 uppercase">{s}% similar</p><h3 className="font-black text-lg mt-1">{b.name}</h3><p className="text-xs text-slate-400 mt-1">{b.brand} • {b.engine_capacity} cc • {b.power_hp} HP</p></div></Link>)}</div></section>

      <section className="bg-slate-950 text-white rounded-[2rem] p-8 md:p-12 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"><div><p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Still Deciding?</p><h3 className="text-2xl md:text-3xl font-black mt-2">Compare {bike.name} with another bike</h3><p className="text-slate-400 text-sm mt-2">See performance, safety, dimensions and features side by side.</p></div><Link href={`/compare?bike1=${bike.id}`} className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-4 rounded-2xl text-center">Start Comparing →</Link></section>
      <footer className="border-t py-7 text-center text-xs text-slate-500">© {new Date().getFullYear()} BikeFinder. Developed with <span className="text-emerald-500">♥</span> by <b>Dishen</b></footer>
    </div>
  </main>;
}

function fmt(v: string|number|undefined, unit: string) { return v !== undefined && v !== null && v !== '' ? `${v} ${unit}` : '-'; }
function calculateScore(b: Bike) { return Math.round((performanceScore(b)+safetyScore(b)+practicalityScore(b)+featureScore(b))/4*10)/10; }
function performanceScore(b: Bike) { const p=Math.min(10,(Number(b.power_hp)||0)/4); const t=Math.min(10,(Number(b.torque_nm)||0)/3); const v=Math.min(10,(Number(b.top_speed_kmph)||0)/20); return Math.max(1,Math.round((p+t+v)/3*10)/10); }
function safetyScore(b: Bike) { let s=5; if(/yes|dual|single|standard|equipped/i.test(String(b.abs||''))) s+=3; if(/yes|standard|available|equipped/i.test(String(b.traction_control||''))) s+=2; return Math.min(10,s); }
function practicalityScore(b: Bike) { let s=6; const w=Number(b.kerb_weight_kg)||0; const m=parseFloat(String(b.fuel_consumption_kmpl||'').replace(/[^\d.]/g,''))||0; if(w && w<=170)s+=1.5; if(m>=40)s+=2; else if(m>=30)s+=1; return Math.min(10,Math.round(s*10)/10); }
function featureScore(b: Bike) { let s=5; if(b.bluetooth_connectivity)s+=1.5; if(b.traction_control)s+=1.5; if(b.cluster)s+=1; if(b.abs)s+=1; return Math.min(10,s); }
function getStrengths(b: Bike) { const a:string[]=[]; if(Number(b.power_hp)>=20)a.push('Strong power output for its class.'); if(Number(b.torque_nm)>=18)a.push('Healthy torque for acceleration and everyday riding.'); if(/yes|dual|single|standard|equipped/i.test(String(b.abs||'')))a.push('ABS-equipped braking system.'); if(Number(b.kerb_weight_kg)>0 && Number(b.kerb_weight_kg)<=170)a.push('Relatively manageable kerb weight.'); if(parseFloat(String(b.fuel_consumption_kmpl||'').replace(/[^\d.]/g,''))>=40)a.push('Strong reported fuel economy.'); if(b.traction_control)a.push('Traction control is listed.'); return a.length?a:['Useful technical specification coverage for comparison.']; }
function getConsiderations(b: Bike) { const a:string[]=[]; if(Number(b.kerb_weight_kg)>=190)a.push('Kerb weight is on the heavier side.'); if(Number(b.saddle_height_mm)>=830)a.push('Higher seat height may not suit every rider.'); if(!b.abs)a.push('ABS information is not available in the current database.'); if(!b.traction_control)a.push('Traction-control information is not listed.'); return a.length?a:['Check the full specification sheet for details before making a decision.']; }
function QuickStat({label,value,highlight=false}:{label:string;value:string;highlight?:boolean}) { return <div className="bg-slate-50 border rounded-xl p-3 text-center"><p className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">{label}</p><p className={`text-sm font-black mt-1 ${highlight?'text-emerald-600':'text-slate-800'}`}>{value}</p></div>; }
function SpecCard({title,icon,description,children}:{title:string;icon:string;description:string;children:React.ReactNode}) { return <div className="bg-white rounded-3xl border shadow-md overflow-hidden"><div className="p-6 border-b bg-gradient-to-r from-white to-emerald-50/30"><div className="flex gap-4"><div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">{icon}</div><div><h3 className="font-black">{title}</h3><p className="text-xs text-slate-400 mt-1">{description}</p></div></div></div><div className="divide-y">{children}</div></div>; }
function SpecItem({label,value}:{label:string;value?:string|number|null}) { return <div className="flex justify-between gap-5 px-6 py-4 hover:bg-slate-50"><span className="text-xs sm:text-sm text-slate-500">{label}</span><span className="text-xs sm:text-sm font-bold text-right max-w-[58%] break-words">{value !== undefined && value !== null && value !== '' ? value : '-'}</span></div>; }