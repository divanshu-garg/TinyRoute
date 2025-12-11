import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteUserUrl, getAllUserUrls } from "../api/user.api";
import { generateQr } from "../api/qr.api.js";
import { useSelector } from "react-redux";
import { queryClient } from "../main";
import QrPopup from "./QrPopup.jsx";
import { useNavigate } from "@tanstack/react-router";

const UserUrls = () => {
  const { user } = useSelector((state) => state.auth);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const navigate = useNavigate();
  const {
    data: urls,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000, // Refetch every 30 seconds to update click counts
    staleTime: 0, // Consider data stale immediately so it refetches when invalidated
  });

  const handleShowQr = (qr_url, short_url) => {
    setShowQr(true);
    setQrUrl(qr_url);
    setShortUrl(short_url);
  };
  const handleGenerateQr = async (shortUrl) => {
    setQrError("");
    setQrLoading(true);
    try {
      const generatedQr = await generateQr(shortUrl);
      if (generatedQr?.qr_code_link) {
        queryClient.invalidateQueries({ queryKey: ["userUrls"] });
        // return setQrUrl(generatedQr.qr_code_link);
      }
    } catch (error) {
      console.log("an error occured while generating qr", error);
      setQrError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setQrLoading(false);
    }
  };

  const handleDeactivationReason = (reason, url) => {
    switch(reason){
      case "expired":
        return "URL Expired";
      case "max_clicks_reached":
        return `Limit Reached(${url.maxClicks})`;
      default:
        "disabled manually";
    }
  }

  const handleDelete = async (url) => {
    // Implement delete functionality here
    try {
      const deleted = await deleteUserUrl(url._id, user._id);
      if (deleted) {
        console.log("url deleted successfully", deleted);
        queryClient.invalidateQueries(["userUrls"]);
      }
    } catch (error) {
      console.log("an error occured while deleting url", error);
    }
  };
  const [copiedId, setCopiedId] = useState(null);
  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Error loading your URLs: {error.message}
      </div>
    );
  }

  if (!urls.urls || urls.urls.length === 0) {
    return (
      <div className="text-center h-30 text-gray-500 my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <svg
          className="w-12 h-12 mx-auto text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        <p className="text-lg font-medium">No URLs found</p>
        <p className="mt-1">You haven't created any shortened URLs yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg mt-5 shadow-md overflow-hidden">
      {showQr && (
        <QrPopup
          showQr={showQr}
          shortUrl={`${import.meta.env.VITE_BACKEND_URI}/${shortUrl}`}
          setShowQr={setShowQr}
          qrUrl={qrUrl}
        />
      )}
      <div className="overflow-x-auto h-84">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Original URL
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Short URL
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Clicks
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                QR
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Analytics
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {urls.urls.reverse().map((url) => (
              <tr key={url._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 truncate max-w-xs">
                    {url.full_url}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <a
                      href={`http://localhost:3000/${url.short_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      {`localhost:3000/${url.short_url}`}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-900">
                    <span className="text-left inline-flex text-xs leading-5 font-semibold">
                      {!url.isActive ? handleDeactivationReason(url.deactivationReason, url) : "Active"}
                    </span>
                  </div>
                </td>
                <td className="px-2 mx-2  py-4 justify-start text-left">
                  <div className="text-sm text-gray-900">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-left font-medium">
                  <button
                    onClick={() =>
                      handleCopy(
                        `http://localhost:3000/${url.short_url}`,
                        url._id
                      )
                    }
                    className={`inline-flex items-center mx-2 text-lg font-semibold px-2 py-1 rounded-md border transition shadow-sm
                    ${
                      copiedId === url._id
                        ? "bg-green-600 text-white border-green-700 shadow hover:bg-green-700"
                        : "bg-black text-white border-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span className={``}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7h8m-8 4h8m-8 4h6m2 5H6a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v12a2 2 0 01-2 2z"
                        />
                      </svg>
                    </span>
                  </button>
                  <button
                    className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-transparent text-xl font-medium rounded-md shadow-sm mx-2 bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() => handleDelete(url)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-5 h-4 text-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 7h12M9 7V4h6v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                      />
                    </svg>
                  </button>
                </td>
                <td className="px-2 mx-2  py-4 justify-center text-center">
                  {url.qr_code_link ? (
                    <button
                      type="submit"
                      onClick={() =>
                        handleShowQr(url.qr_code_link, url.short_url)
                      }
                      className="px-3 py-2 m-3 bg-green-600 text-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed cursor-pointer text-white font-regular rounded-lg shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        />
                    </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={qrLoading}
                      onClick={() => handleGenerateQr(url.short_url)}
                      className={`px-4 py-1.5 m-3 hover:bg-red-700 bg-red-500 disabled:bg-red-400 disabled:cursor-not-allowed cursor-pointer text-white font-regular rounded-lg shadow-md`}
                    >
                      ⊕
                    </button>
                  )}
                  {qrError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                      Error loading your URLs: {qrError}
                    </div>
                  )}
                </td>
                <td className="px-0 py-4 text-sm font-medium">
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xl font-medium rounded-md shadow-sm ml-5 bg-white-800 hover:bg-white-900 text-white-100
                    text-green-500 cursor-pointer"
                    onClick={() =>
                      navigate({
                        to: "/analytics/$urlId",
                        params: {
                        urlId: url._id,
                      },
                        state: {
                        longUrl: url.full_url,
                        shortUrl: `http://localhost:3000/${url.short_url}`,
                      }
                      })
                    }
                  >
                    🔎
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserUrls;
