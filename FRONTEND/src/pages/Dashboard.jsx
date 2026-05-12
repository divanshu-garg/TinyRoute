import UrlForm from "../components/UrlForm.jsx";
import UserUrls from "../components/UserUrls.jsx";

function Dashboard() {
  return (
    <div className="min-h-screen bg-base">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-accent/20 bg-accent/5 mb-4">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-mono">system online</span>
          </div>

          <h1 className="text-2xl font-mono font-semibold text-text-primary tracking-tight">
            tiny<span className="text-accent">route</span>
          </h1>
          <p className="mt-1.5 text-sm text-text-muted">
            Shorten, track, and manage your links.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 mb-3">
          <UrlForm />
        </div>

        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Your Links
            </span>
          </div>
          <UserUrls />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
