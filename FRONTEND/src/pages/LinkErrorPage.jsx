import { useParams, Link } from "@tanstack/react-router";

const ERROR_DETAILS = {
  expired: {
    code: "410 EXPIRED",
    title: "Link Lifespan Ended",
    message:
      "This routing path has exceeded its designated lifespan. The destination has been purged from the active registry.",
    nodeColor: "bg-text-muted",
    glow: "shadow-[0_0_15px_rgba(139,146,153,0.3)]",
  },
  max_clicks: {
    code: "429 LIMIT REACHED",
    title: "Traffic Capacity Exceeded",
    message:
      "This route has hit its maximum allowed click threshold. It has been automatically disabled to prevent further traffic.",
    nodeColor: "bg-danger",
    glow: "shadow-[0_0_15px_rgba(248,113,113,0.3)]",
  },
  not_found: {
    code: "404 NOT FOUND",
    title: "Destination Unknown",
    message:
      "The requested route signature does not exist, was typed incorrectly, or has been permanently destroyed.",
    nodeColor: "bg-danger",
    glow: "shadow-[0_0_15px_rgba(248,113,113,0.3)]",
  },
  default: {
    code: "500 FAULT",
    title: "Routing Exception",
    message:
      "A system fault occurred while attempting to resolve this trajectory. Please verify the URL.",
    nodeColor: "bg-danger",
    glow: "shadow-[0_0_15px_rgba(248,113,113,0.3)]",
  },
};

const LinkErrorPage = () => {
  const { reason } = useParams({ from: "/error/$reason" });
  const details = ERROR_DETAILS[reason] || ERROR_DETAILS.default;

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Background Glow based on error type */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none rounded-full blur-[100px]"
        style={{
          background:
            reason === "expired"
              ? "radial-gradient(circle, #4a5260 0%, transparent 70%)"
              : "radial-gradient(circle, #f87171 0%, transparent 70%)",
        }}
      />

      {/* Grid Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* The Card */}
        <div className="bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm relative">
          {/* Top highlight line for 3D depth */}
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          {/* Custom Route Visualization Component */}
          <div className="bg-base/40 border-b border-border-sub p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="flex items-center w-full max-w-[280px] justify-between relative">
              {/* Origin Node (System Online) */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="size-4 rounded-full bg-accent shadow-[0_0_15px_rgba(16,185,129,0.4)] border-2 border-surface flex items-center justify-center">
                  <div className="size-1.5 bg-white rounded-full animate-pulse" />
                </div>
                <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                  Origin
                </span>
              </div>

              {/* The "Broken" Path Line */}
              <div className="flex-1 mx-3 relative h-0.5">
                {/* Base dashed line */}
                <div className="absolute inset-0 border-t-2 border-dashed border-border-sub" />

                {/* Animated failing packet (moves halfway and fades) */}
                <div className="absolute top-[-3px] left-0 size-2 bg-text-primary rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />

                {/* Cross block indicating break */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base p-1 rounded-full">
                  <svg
                    className="size-3 text-text-faint"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              {/* Destination Node (Error State) */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`size-4 rounded-full ${details.nodeColor} ${details.glow} border-2 border-surface`}
                />
                <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
                  Target
                </span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="p-6 sm:p-8 text-center">
            <div className="inline-block px-2.5 py-1 rounded-md bg-border-sub/50 border border-border mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-text-faint">
                {details.code}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-sans font-bold text-text-primary tracking-tight mb-3">
              {details.title}
            </h1>

            <p className="text-sm text-text-muted leading-relaxed mb-8 px-2">
              {details.message}
            </p>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/dashboard"
                className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg bg-text-primary/4 text-text-primary border border-border hover:bg-text-primary/8 hover:border-text-muted/30 transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg bg-accent text-base hover:bg-accent-hover transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                New Link
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center font-mono text-sm font-semibold tracking-tight text-text-faint hover:text-text-primary transition-colors"
          >
            tiny<span className="text-accent">route</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkErrorPage;
