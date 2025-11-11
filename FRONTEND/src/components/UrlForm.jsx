import { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api.js";

const UrlForm = () => {
//   const [loading, setLoading] = useState(false);
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false)
  console.log(longUrl);

  const handleSubmit = async () => {
    const data = await createShortUrl(longUrl)
    console.log(data);
    await setShortUrl(data.short_url);
  };

  const handleCopy = () =>{
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
}

  return (
    <div>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
        //   disabled={loading}
          className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          {/* {loading ? "Shortening..." : "Shorten URL"} */}
          Shorten URL
        </button>
      </div>

      {/* {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )} */}

      {shortUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your short URL:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 text-sm rounded transition ${copied ? "bg-green-600 text-lg hover:bg-green-700 text-white": "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
