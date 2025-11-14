import { useState } from "react";
import { createCustomShortUrl, createShortUrl } from "../api/shortUrl.api.js";
import { useSelector } from "react-redux";
import { queryClient } from "../main.jsx";

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false)
  const [customSlug, setCustomSlug] = useState("");
  const [error, setError] = useState(null);
  const {isAuthenticated} = useSelector((state) => state.auth);
  // console.log(longUrl);

const ensureValidUrl =(url)=>{
    if(!url.startsWith("https://") && !url.startsWith("http://")){
      return "https://"+url;
    }
    return url;
}

  const handleSubmit = async () => {
    const validUrl = ensureValidUrl(longUrl);
    setLongUrl(validUrl);
    console.log(validUrl);
    
    try {  
      let data;
      if(isAuthenticated && customSlug) data = await createCustomShortUrl(validUrl, customSlug)
      else data = await createShortUrl(validUrl);
      console.log("data:",data);
      await setShortUrl(data.short_url);
      queryClient.invalidateQueries({queryKey: ['userUrls']});
    } catch (error) {
      console.log("an error occured while shortening url", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }};

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
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
      )}

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
