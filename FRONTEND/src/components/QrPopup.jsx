import { useState, useEffect } from "react";

// Minimalist 1.5px stroke icons
const CloseIcon = ({ className }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const CopyIcon = ({ className }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
    />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);

const QrPopup = ({ showQr, setShowQr, qrUrl, shortUrl }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowQr(false);
    };
    if (showQr) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [showQr, setShowQr]);

  if (!showQr) return null;

  const handleDownload = async () => {
    // Kept your exact backend routing logic
    window.location.href = `${import.meta.env.VITE_BACKEND_URI}/api/qr/download/${shortUrl.split("/").slice(-1)[0]}`;
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-base/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setShowQr(false)}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="size-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Asset Generated
            </h2>
          </div>
          <button
            onClick={() => setShowQr(false)}
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-text-primary/6 rounded-md transition-colors"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        {/* Viewfinder (QR Display Area) */}
        <div className="relative p-8 bg-base flex justify-center items-center">
          {/* Background Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Targeting Bracket Frame */}
          <div className="relative p-4">
            {/* 4 Corner Brackets */}
            <div className="absolute top-0 left-0 size-4 border-t-2 border-l-2 border-text-muted rounded-tl-sm" />
            <div className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-text-muted rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-text-muted rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-text-muted rounded-br-sm" />

            {/* The Image Container */}
            <div className="relative size-48 sm:size-56 bg-white rounded-lg shadow-inner overflow-hidden flex items-center justify-center p-2">
              {imageLoading && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3">
                  <div className="w-full h-1 bg-accent/20 overflow-hidden absolute top-1/2 -translate-y-1/2">
                    <div className="w-full h-full bg-accent animate-[ping_1.5s_ease-in-out_infinite]" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 mt-8 uppercase tracking-widest">
                    Scanning...
                  </span>
                </div>
              )}
              <img
                src={qrUrl}
                alt="QR Code"
                className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setImageLoading(false)}
              />
            </div>
          </div>
        </div>

        {/* Data Output & Actions */}
        <div className="p-5 border-t border-border space-y-5">
          {/* Target URL Readout */}
          <div>
            <span className="block text-[10px] font-mono text-text-faint uppercase tracking-wider mb-1.5">
              Target Routing
            </span>
            <div className="w-full bg-base border border-border-sub rounded-lg p-2.5 flex items-center gap-2">
              <span className="text-accent shrink-0">
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
              </span>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-text-primary hover:text-accent truncate transition-colors"
              >
                {shortUrl}
              </a>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyUrl}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border transition-all duration-200
                ${
                  copied
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-surface border-border hover:bg-white/4 text-text-muted hover:text-text-primary hover:border-text-muted/30"
                }`}
            >
              {copied ? (
                <CheckIcon className="size-5" />
              ) : (
                <CopyIcon className="size-5" />
              )}
              <span className="text-xs font-medium">
                {copied ? "Copied ID" : "Copy Image URL"}
              </span>
            </button>

            <button
              onClick={handleDownload}
              className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg bg-accent border border-transparent hover:bg-accent-hover text-base transition-all duration-200 shadow-sm"
            >
              <DownloadIcon className="size-5" />
              <span className="text-xs font-semibold">Download SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPopup;
