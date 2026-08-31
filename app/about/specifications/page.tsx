'use client';

import Link from 'next/link';

export default function SpecificationsPage() {
  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900 overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-400/10 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] -left-48 w-[500px] h-[500px] bg-cyan-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-300/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">

            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo/bikefinderlogo.jpeg"
                alt="BikeFinder"
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />

              <div>
                <p className="text-xl sm:text-2xl font-black">
                  BIKE<span className="text-emerald-500">FINDER</span>
                </p>

                <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                  DISCOVER. COMPARE. RIDE.
                </p>
              </div>
            </Link>

            <nav className="hidden sm:flex items-center gap-7">

              <Link
                href="/"
                className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
              >
                Explore Bikes
              </Link>

              <Link
                href="/compare"
                className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition"
              >
                Compare
              </Link>

              {/* FIXED ROUTE */}
              <Link
                href="/about/specifications"
                className="text-sm font-bold text-emerald-600"
              >
                Specifications
              </Link>

            </nav>

            <Link
              href="/"
              className="bg-slate-950 text-white px-5 py-3 rounded-full text-sm font-bold hover:bg-emerald-600 transition"
            >
              Back to Bikes →
            </Link>

          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 sm:pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

            <span className="text-xs font-black text-slate-600 tracking-wide">
              DATA TRANSPARENCY
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mt-7">
            Specification Accuracy
            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-500">
              & Sources.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto mt-7 text-base sm:text-lg text-slate-500 leading-8">
            We collect and cross-check motorcycle specifications from
            manufacturer information and other reputable sources. However,
            motorcycle specifications can vary between markets, model years,
            variants and testing standards.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">

            <a
              href="#methodology"
              className="bg-slate-950 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition"
            >
              How We Verify Data
            </a>

            <a
              href="#differences"
              className="bg-white border border-slate-200 px-6 py-3.5 rounded-xl font-bold hover:border-emerald-400 transition"
            >
              Why Specs Differ
            </a>

          </div>
        </div>
      </section>

      {/* Main Notice */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2rem] p-7 sm:p-10 shadow-2xl">

            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="relative">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center text-2xl">
                  ✓
                </div>

                <div>

                  <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">
                    Important
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-black mt-2">
                    Specifications are not guaranteed to be 100% universal.
                  </h2>

                  <p className="text-slate-400 leading-7 mt-4 max-w-3xl">
                    The figures displayed on BikeFinder are intended as
                    reference information. A specification reported for one
                    motorcycle may differ from another source because of
                    market, model year, variant, measurement method or unit
                    conversion differences.
                  </p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Specs Differ */}
      <section
        id="differences"
        className="py-20 sm:py-24 bg-white/70 border-y border-slate-200/70"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
              Understanding The Numbers
            </span>

            <h2 className="text-3xl sm:text-5xl font-black mt-3">
              Why can the same motorcycle have different specifications?
            </h2>

            <p className="text-slate-500 leading-7 mt-5">
              Different sources do not always publish identical figures.
              This does not automatically mean that one source is incorrect.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">

            <InfoCard
              icon="🌍"
              title="Market & Region"
              text="A motorcycle can have different specifications depending on the country or market where it is sold."
            />

            <InfoCard
              icon="📅"
              title="Model Year"
              text="Manufacturers can update engines, electronics, exhaust systems or other components between model years."
            />

            <InfoCard
              icon="🏍️"
              title="Variant"
              text="Different trims or variants of the same motorcycle name may have different equipment and specifications."
            />

            <InfoCard
              icon="📏"
              title="Testing Methods"
              text="Performance figures such as power, torque and top speed can depend on the testing method and conditions."
            />

            <InfoCard
              icon="🔢"
              title="Units & Conversion"
              text="Power may be reported using HP, PS or kW. Small differences can appear when converting between these units."
            />

            <InfoCard
              icon="⚙️"
              title="Manufacturer Reporting"
              text="Manufacturers may publish rounded figures or use different technical specifications for different regions."
            />

          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-20 sm:py-24">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden">

            <div className="p-7 sm:p-10 border-b border-slate-100">

              <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
                Example
              </span>

              <h2 className="text-3xl sm:text-4xl font-black mt-3">
                A specification can look different across sources
              </h2>

              <p className="text-slate-500 leading-7 mt-4">
                Imagine a motorcycle specification is reported with a power
                figure in one source and a slightly different figure in
                another source. Before deciding that one is wrong, we check
                the units, model year, market and variant.
              </p>

            </div>

            <div className="grid sm:grid-cols-3 gap-4 p-7 sm:p-10 bg-slate-50">

              <ExampleBox
                label="SOURCE A"
                value="67.5 kW"
                note="Manufacturer specification"
              />

              <ExampleBox
                label="SOURCE B"
                value="~92 PS"
                note="Converted / rounded figure"
              />

              <ExampleBox
                label="BIKEFINDER"
                value="Reference"
                note="Cross-check before publishing"
              />

            </div>

            <div className="px-7 sm:px-10 pb-8 sm:pb-10">

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mt-2">

                <p className="text-sm text-emerald-900 leading-6">
                  <b>Key point:</b> A small numerical difference does not
                  necessarily indicate that a motorcycle itself is different.
                  Units, rounding, market specifications and measurement
                  methods can all affect published figures.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Methodology */}
      <section
        id="methodology"
        className="py-20 sm:py-28 bg-slate-950 text-white"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <span className="text-xs font-black text-emerald-400 tracking-[0.2em] uppercase">
              Our Methodology
            </span>

            <h2 className="text-4xl sm:text-5xl font-black mt-4">
              How BikeFinder handles specifications.
            </h2>

            <p className="text-slate-400 leading-8 mt-5">
              Our goal is not simply to collect numbers. We aim to provide
              useful, transparent and appropriately qualified information.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">

            <MethodCard
              number="01"
              title="Collect"
              text="Gather specifications from manufacturer information and reliable motorcycle sources."
            />

            <MethodCard
              number="02"
              title="Compare"
              text="Cross-check important figures against available sources to identify possible differences."
            />

            <MethodCard
              number="03"
              title="Review"
              text="Consider model year, market, variant, units and the way the specification was reported."
            />

            <MethodCard
              number="04"
              title="Present"
              text="Publish the information as reference data rather than claiming universal 100% accuracy."
            />

          </div>

        </div>
      </section>

      {/* Accuracy Levels */}
      <section className="py-20 sm:py-28">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto">

            <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
              Data Confidence
            </span>

            <h2 className="text-4xl sm:text-5xl font-black mt-3">
              Understanding our accuracy levels.
            </h2>

            <p className="text-slate-500 leading-7 mt-5">
              When possible, we distinguish between directly supported
              specifications and information that may require additional
              verification.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">

            <AccuracyCard
              symbol="✓"
              title="Manufacturer Verified"
              description="The specification is supported by an official manufacturer source."
              badge="Highest confidence"
              badgeClass="bg-emerald-50 text-emerald-700 border-emerald-100"
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <AccuracyCard
              symbol="↔"
              title="Cross-Checked"
              description="The specification is supported by multiple reliable sources."
              badge="High confidence"
              badgeClass="bg-blue-50 text-blue-700 border-blue-100"
              iconClass="bg-blue-50 text-blue-600"
            />

            <AccuracyCard
              symbol="~"
              title="Secondary Source"
              description="A reliable secondary source is available, but an official figure may not be available."
              badge="Use with context"
              badgeClass="bg-amber-50 text-amber-700 border-amber-100"
              iconClass="bg-amber-50 text-amber-600"
            />

            <AccuracyCard
              symbol="?"
              title="Unavailable"
              description="We could not confidently verify the specification from suitable sources."
              badge="Not confirmed"
              badgeClass="bg-slate-100 text-slate-600 border-slate-200"
              iconClass="bg-slate-100 text-slate-600"
            />

          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-20 sm:py-24 bg-white border-y border-slate-200">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center">

            <span className="text-xs font-black text-emerald-600 tracking-[0.2em] uppercase">
              Source Priority
            </span>

            <h2 className="text-3xl sm:text-5xl font-black mt-3">
              Where our information comes from.
            </h2>

          </div>

          <div className="mt-12 space-y-4">

            <SourceRow
              number="01"
              title="Motorcycle Manufacturer"
              description="Official manufacturer websites, specifications and product information."
              priority="Primary"
            />

            <SourceRow
              number="02"
              title="Official Technical Documentation"
              description="Technical documents and official specification material when available."
              priority="Primary"
            />

            <SourceRow
              number="03"
              title="Reputable Motorcycle Sources"
              description="Established motorcycle publications and trusted specification databases."
              priority="Secondary"
            />

            <SourceRow
              number="04"
              title="Cross-Reference"
              description="Comparing multiple sources to identify inconsistencies and possible errors."
              priority="Verification"
            />

          </div>

        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-20">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="border border-amber-200 bg-amber-50 rounded-[2rem] p-7 sm:p-10">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
                ⚠️
              </div>

              <div>

                <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
                  Important disclaimer
                </h2>

                <div className="mt-4 space-y-3 text-sm sm:text-base text-amber-900/75 leading-7">

                  <p>
                    BikeFinder is a motorcycle research and comparison
                    platform. The specifications displayed on the website
                    are provided for general informational and reference
                    purposes.
                  </p>

                  <p>
                    Specifications may change between countries, model years,
                    variants and production versions. Performance figures can
                    also vary depending on testing conditions and measurement
                    standards.
                  </p>

                  <p>
                    BikeFinder therefore does not represent that every
                    specification is guaranteed to be 100% accurate for every
                    motorcycle, market or production unit.
                  </p>

                  <p className="font-semibold text-amber-950">
                    For purchasing, registration, legal, insurance or other
                    important decisions, users should verify the specification
                    with the motorcycle manufacturer or an authorized source.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-[2rem] p-8 sm:p-12 text-center text-white shadow-2xl">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
              Explore BikeFinder
            </p>

            <h2 className="text-3xl sm:text-5xl font-black mt-4">
              Ready to compare motorcycles?
            </h2>

            <p className="max-w-xl mx-auto mt-4 text-white/80 leading-7">
              Explore motorcycle specifications, filter bikes by technical
              requirements and compare your options.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

              <Link
                href="/"
                className="bg-slate-950 text-white px-7 py-4 rounded-xl font-bold hover:bg-white hover:text-slate-950 transition"
              >
                Explore Motorcycles →
              </Link>

              <Link
                href="/compare"
                className="bg-white/15 border border-white/30 text-white px-7 py-4 rounded-xl font-bold hover:bg-white/20 transition"
              >
                Compare Bikes
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            <div className="text-center sm:text-left">

              <p className="font-black">
                BIKE<span className="text-emerald-400">FINDER</span>
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Specification-first motorcycle research platform.
              </p>

            </div>

            <div className="flex items-center gap-5 text-xs text-slate-500">

              <Link
                href="/"
                className="hover:text-emerald-400 transition"
              >
                Home
              </Link>

              <Link
                href="/compare"
                className="hover:text-emerald-400 transition"
              >
                Compare
              </Link>

              {/* FIXED ROUTE */}
              <Link
                href="/about/specifications"
                className="text-emerald-400"
              >
                Data Sources
              </Link>

            </div>

          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} BikeFinder. All rights reserved.
          </div>

        </div>
      </footer>

    </main>
  );
}


/* -------------------------------------------------------
   Reusable Components
------------------------------------------------------- */

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all">

      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">
        {icon}
      </div>

      <h3 className="text-lg font-black mt-6">
        {title}
      </h3>

      <p className="text-sm text-slate-500 leading-6 mt-3">
        {text}
      </p>

    </div>
  );
}


function ExampleBox({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <p className="text-[10px] font-black tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <p className="text-2xl font-black mt-3">
        {value}
      </p>

      <p className="text-xs text-slate-500 mt-2">
        {note}
      </p>

    </div>
  );
}


function MethodCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition">

      <div className="flex items-center justify-between">

        <span className="text-emerald-400 text-sm font-black">
          {number}
        </span>

        <span className="w-8 h-px bg-white/20" />

      </div>

      <h3 className="text-xl font-black mt-7">
        {title}
      </h3>

      <p className="text-sm text-slate-400 leading-6 mt-3">
        {text}
      </p>

    </div>
  );
}


function AccuracyCard({
  symbol,
  title,
  description,
  badge,
  badgeClass,
  iconClass,
}: {
  symbol: string;
  title: string;
  description: string;
  badge: string;
  badgeClass: string;
  iconClass: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition">

      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${iconClass}`}
      >
        {symbol}
      </div>

      <h3 className="font-black text-lg mt-6">
        {title}
      </h3>

      <p className="text-sm text-slate-500 leading-6 mt-3 min-h-[72px]">
        {description}
      </p>

      <span
        className={`inline-flex mt-5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wide ${badgeClass}`}
      >
        {badge}
      </span>

    </div>
  );
}


function SourceRow({
  number,
  title,
  description,
  priority,
}: {
  number: string;
  title: string;
  description: string;
  priority: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:items-center">

      <div className="w-12 h-12 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-black">
        {number}
      </div>

      <div className="flex-1">

        <h3 className="font-black">
          {title}
        </h3>

        <p className="text-sm text-slate-500 mt-1 leading-6">
          {description}
        </p>

      </div>

      <span className="self-start sm:self-center bg-white border border-slate-200 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
        {priority}
      </span>

    </div>
  );
}