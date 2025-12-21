import { useState } from "react";
import { createCustomShortUrl, createShortUrl } from "../api/shortUrl.api.js";
import { useSelector } from "react-redux";
import { queryClient } from "../main.jsx";
import { generateQr } from "../api/qr.api.js";
import QrPopup from "./QrPopup.jsx";

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [maxClicks, setMaxClicks] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log(longUrl);

  const ensureValidUrl = (url) => {
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      return "https://" + url;
    }
    return url;
  };

  const handleSubmit = async () => {
    setError("");
    setShortUrl("");
    setLoading(true);
    setQrUrl("");
    const validUrl = ensureValidUrl(longUrl);
    setLongUrl(validUrl);
    console.log(validUrl);

    try {
      let data;
      if (isAuthenticated && customSlug)
        data = await createCustomShortUrl(
          validUrl,
          customSlug,
          maxClicks,
          expiresAt
        );
      else data = await createShortUrl(validUrl, maxClicks, expiresAt);
      console.log("data:", data);
      await setShortUrl(data.short_url);
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    } catch (error) {
      console.log("an error occured while shortening url", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleGenerateQr = async (shortUrl) => {
    setError("");
    setLoading(true);
    try {
      const generatedQr = await generateQr(shortUrl.split("/").slice(-1)[0]);
      if (generatedQr?.qr_code_link) {
        queryClient.invalidateQueries({ queryKey: ["userUrls"] });
        return setQrUrl(generatedQr.qr_code_link);
      }
    } catch (error) {
      console.log("an error occured while generating qr", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShowQr = () => {
    setShowQr(true);
    // <QrPopup  />
  };

  return (
    <div
      // className="mb-25"
      className="mb-6 max-w-[900px] w-full mx-auto px-3"
    >
      {showQr && (
        <QrPopup
          showQr={showQr}
          setShowQr={setShowQr}
          qrUrl={qrUrl}
          shortUrl={shortUrl}
        />
      )}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your URL
          </label>
          <input
            type="url"
            id="url"
            value={longUrl}
            onChange={(e) => setLongUrl(() => e.target.value)}
            placeholder="https://example.com"
            // className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            className="w-full min-w-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm break-words"
            required
          />
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full text-center bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </div>
      {shortUrl && (
      // {true && (
        <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <label className="block text-center text-sm font-semibold text-gray-700 mb-2">
            Your short URL
          </label>
          <div className="flex items-center gap-2 flex-col sm:flex-row">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 min-w-0 truncate px-3 py-2 bg-white border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleCopy}
              className={`w-full sm:w-auto px-4 py-2 text-sm rounded transition ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
      {/* generate qr button, view qr button */}
      {isAuthenticated && shortUrl ? (
        qrUrl ? (
        // true ? (
          <div className="mt-6 flex flex-col justify-center md:flex-row md:items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              onClick={handleShowQr}
              className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white cursor-pointer disabled:cursor-not-allowed font-semibold rounded-lg shadow-md text-center"
            >
              {loading ? "Showing QR..." : "Show QR"}
            </button>
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              onClick={() => handleGenerateQr(shortUrl)}
              className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white disabled:cursor-not-allowed cursor-pointer font-semibold rounded-lg shadow-md text-center"
            >
              {loading ? "Generating QR..." : "Generate QR"}
            </button>
          </div>
        )
      ) : null}
      {isAuthenticated && (
        <div className="mt-4">
          <label
            htmlFor="customSlug"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Custom Slug (optional)
          </label>
          <input
            type="text"
            id="customSlug"
            value={customSlug}
            onChange={(e) => setCustomSlug(() => e.target.value)}
            placeholder="your-custom-slug"
            className="w-full min-w-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none transition"
          />
        </div>
      )}
      {/* expiry feature: */}
      {isAuthenticated && (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold underline text-gray-700 mb-4">
            Advanced Options (Optional)
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="datetime-local"
              id="expiryDate"
              value={expiresAt || ""}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Clicks
            </label>
            <input
              type="number"
              id="maxClicks"
              value={maxClicks || ""}
              placeholder="Leave empty for unlimited"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none transition"
              onChange={(e) => setMaxClicks(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
