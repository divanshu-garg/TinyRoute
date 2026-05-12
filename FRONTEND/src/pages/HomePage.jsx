import React from "react";
import UrlForm from "../components/UrlForm";
import { Link } from "@tanstack/react-router";

const FeatureCard = ({
  label,
  title,
  description,
  children,
  className = "",
}) => (
  <div
    className={`bg-surface border border-border rounded-2xl p-8 relative overflow-hidden flex flex-col ${className}`}
  >
    <div className="relative z-10 mb-12">
      <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] font-bold">
        {label}
      </span>
      <h3 className="text-xl font-bold text-text-primary mt-2 mb-3">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed max-w-60">
        {description}
      </p>
    </div>
    <div className="mt-auto relative z-10">{children}</div>
    {/* Subtle gradient wash */}
    <div className="absolute inset-0 bg-linear-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base relative overflow-x-hidden">
      {/* Background Infrastructure */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted">
            Infrastructure for modern links
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-sans font-bold text-text-primary tracking-tight mb-6 max-w-4xl">
          The link manager for <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent via-accent-hover to-accent-dim">
            modern developers.
          </span>
        </h1>

        <p className="max-w-xl text-lg text-text-muted leading-relaxed mb-12">
          TinyRoute provides the telemetry and tools you need to shorten, track,
          and secure your routing at scale.
        </p>

        <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl p-2 shadow-2xl mb-24">
          <div className="bg-base rounded-xl p-6 sm:p-8">
            <UrlForm />
          </div>
        </div>
      </section>

      {/* 2. FEATURES BENTO GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          {/* Feature 1: Analytics (Large) */}
          <FeatureCard
            label="Telemetry"
            title="Real-time Analytics"
            description="Deep dive into your traffic with device, browser, and geographic breakdowns."
            className="md:col-span-6 lg:col-span-7 h-[400px]"
          >
            {/* Visual Teaser: Mini CSS Chart */}
            <div className="flex items-end gap-2 h-24">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-accent/20 rounded-t-sm relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute inset-0 bg-accent opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* Feature 2: QR Codes (Medium) */}
          <FeatureCard
            label="Visual"
            title="Dynamic QR Codes"
            description="Instantly generate high-resolution QR codes for every link you create."
            className="md:col-span-6 lg:col-span-5 h-[400px]"
          >
            {/* Visual Teaser: CSS QR Code Placeholder */}
            <div className="size-32 border-4 border-border-sub rounded-xl p-2 bg-white mx-auto rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-[url('https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/core_market/generator/dist/generator/assets/images/website_qr.png')] bg-cover opacity-80" />
            </div>
          </FeatureCard>

          {/* Feature 3: Custom Slugs */}
          <FeatureCard
            label="Branding"
            title="Custom Slugs"
            description="Replace random strings with branded keywords to increase trust and CTR."
            className="md:col-span-3 lg:col-span-4 h-80"
          >
            <div className="font-mono text-sm bg-base border border-border p-3 rounded-lg text-accent">
              tinyroute.io/<span className="text-text-primary">my-brand</span>
            </div>
          </FeatureCard>

          {/* Feature 4: Performance */}
          <FeatureCard
            label="Engine"
            title="Global Edge Routing"
            description="Ultra-low latency redirects powered by our high-performance backend."
            className="md:col-span-3 lg:col-span-4 h-80"
          >
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-border-sub rounded-full overflow-hidden">
                <div className="h-full w-full bg-accent animate-[slide_2s_infinite]" />
              </div>
              <span className="font-mono text-[10px] text-accent">14ms</span>
            </div>
          </FeatureCard>

          {/* Feature 5: Security */}
          <FeatureCard
            label="Security"
            title="Link Expiry"
            description="Set links to self-destruct after a specific time or click count."
            className="md:col-span-6 lg:col-span-4 h-80"
          >
            <div className="flex items-center gap-3 text-text-faint">
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-xs uppercase tracking-widest">
                Encrypted
              </span>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="relative z-10 py-32 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-text-primary mb-6">
            Ready to optimize your traffic?
          </h2>
          <p className="text-text-muted mb-10 text-lg">
            Join the developer-first platform for link management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-4 bg-accent text-base font-bold rounded-xl hover:bg-accent-hover transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Get Started for Free
            </Link>
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-4 bg-surface border border-border text-text-primary font-bold rounded-xl hover:bg-white/5 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-12 border-t border-border bg-surface/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-lg font-bold text-text-primary">
            tiny<span className="text-accent">route</span>
          </div>
          <div className="text-text-faint text-xs font-mono uppercase tracking-widest">
            © 2026 Divanshu Garg. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Global CSS for some of the custom animations used above */}
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
