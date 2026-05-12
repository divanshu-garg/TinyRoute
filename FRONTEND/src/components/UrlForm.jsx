import { useState } from "react";
import { createCustomShortUrl, createShortUrl } from "../api/shortUrl.api.js";
import { useSelector } from "react-redux";
import { queryClient } from "../main.jsx";
import { generateQr } from "../api/qr.api.js";
import QrPopup from "./QrPopup.jsx";

const Input = ({ label, id, className = "", ...props }) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="block text-xs font-medium text-text-muted mb-1.5"
      >
        {label}
      </label>
    )}
    <input
      id={id}
      className={`w-full bg-base border border-border rounded-md px-3 py-2.5 text-sm text-text-primary
        placeholder-text-faint outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20
        transition-colors ${className}`}
      {...props}
    />
  </div>
);

const ensureValidUrl = (url) =>
  url.startsWith("http://") || url.startsWith("https://")
    ? url
    : "https://" + url;

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [maxClicks, setMaxClicks] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    setError("");
    setShortUrl("");
    setQrUrl("");
    setLoading(true);

    const validUrl = ensureValidUrl(longUrl);
    setLongUrl(validUrl);

    try {
      const data =
        isAuthenticated && customSlug
          ? await createCustomShortUrl(
              validUrl,
              customSlug,
              maxClicks || null,
              expiresAt || null,
            )
          : await createShortUrl(
              validUrl,
              maxClicks || null,
              expiresAt || null,
            );
      setShortUrl(data.short_url);
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    } catch (err) {
      setError(
        err.response?.data?.message ?? "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateQr = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await generateQr(shortUrl.split("/").pop());
      if (res?.qr_code_link) {
        setQrUrl(res.qr_code_link);
        queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {showQr && (
        <QrPopup
          showQr={showQr}
          setShowQr={setShowQr}
          qrUrl={qrUrl}
          shortUrl={shortUrl}
        />
      )}

      <div className="flex gap-2 flex-col sm:flex-row">
        <div className="flex-1">
          <Input
            id="url"
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://your-very-long-url.com/goes/here"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !longUrl}
          className="sm:w-auto w-full px-5 py-2.5 text-sm font-semibold text-base bg-accent
            hover:bg-accent-hover disabled:bg-accent-dim disabled:text-text-faint disabled:cursor-not-allowed
            rounded-md transition-colors duration-150 shrink-0"
        >
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-danger-bg border border-danger/50 text-danger text-xs">
          <span className="size-1.5 rounded-full bg-danger shrink-0" />
          {error}
        </div>
      )}

      {shortUrl && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-accent/5 border border-accent/20">
          <span className="size-1.5 rounded-full bg-accent shrink-0" />
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 text-sm text-accent hover:text-accent-hover truncate font-mono transition-colors"
          >
            {shortUrl}
          </a>
          <button
            onClick={handleCopy}
            className={`shrink-0 px-3 py-1.5 text-xs rounded-md border transition-colors duration-150 font-medium
              ${
                copied
                  ? "bg-accent/20 border-accent/40 text-accent"
                  : "bg-text-primary/4 border-text-primary/8 text-text-muted hover:text-text-primary hover:border-text-primary/20"
              }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>

          {isAuthenticated &&
            (qrUrl ? (
              <button
                onClick={() => setShowQr(true)}
                className="shrink-0 px-3 py-1.5 text-xs rounded-md border border-text-primary/8 bg-text-primary/4
                  text-text-muted hover:text-text-primary hover:border-text-primary/20 transition-colors"
              >
                View QR
              </button>
            ) : (
              <button
                onClick={handleGenerateQr}
                disabled={loading}
                className="shrink-0 px-3 py-1.5 text-xs rounded-md border border-text-primary/8 bg-text-primary/4
                  text-text-muted hover:text-text-primary hover:border-text-primary/20 disabled:opacity-40 transition-colors"
              >
                Gen QR
              </button>
            ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="space-y-4">
          <Input
            label="Custom slug (optional)"
            id="customSlug"
            type="text"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder="my-custom-slug"
          />

          <button
            onClick={() => setAdvancedOpen((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <svg
              className={`size-3.5 transition-transform ${advancedOpen ? "rotate-90" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            Advanced options
          </button>

          {advancedOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Input
                label="Expiry date"
                id="expiryDate"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <Input
                label="Max clicks"
                id="maxClicks"
                type="number"
                value={maxClicks}
                onChange={(e) => setMaxClicks(e.target.value)}
                placeholder="Unlimited"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UrlForm;
