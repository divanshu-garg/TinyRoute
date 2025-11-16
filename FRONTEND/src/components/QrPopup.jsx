import { useState, useEffect } from 'react';

const QrPopup = ({ showQr, setShowQr, qrUrl, shortUrl }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Close on esc key
  useEffect(() => {
    // console.log("short url", shortUrl)
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowQr(false);
    };
    if (showQr) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [showQr, setShowQr]);

  if (!showQr) return null;

  const handleDownload = async () => {
  // doesn't work with axios as it make another call to claudinary  with credentials true in header, and claudinary sends wildcard(*) cors header that gets blocked by browser
  // so i used navigation instead of fetching, so i just navigate to user to my backend api endpoint that triggers download
  window.location.href = `${import.meta.env.VITE_BACKEND_URI}/api/qr/download/${shortUrl.split('/').slice(-1)[0]}`;
};

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={() => setShowQr(false)}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowQr(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">QR Code</h2>

        <div className="bg-gray-50 rounded-lg p-6 mb-4 flex items-center justify-center">
          {imageLoading && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          )}
          <img
            src={qrUrl}
            alt="QR Code"
            className={`max-w-full h-auto ${imageLoading ? 'hidden' : 'block'}`}
            onLoad={() => setImageLoading(false)}
          />
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Short URL:</p>
          <a href={shortUrl} className="text-blue-600 font-medium break-all" target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          
          <button
            onClick={handleCopyUrl}
            className={`flex-1 ${copied ? 'bg-green-600' : 'bg-gray-600'} hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy URL
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrPopup;