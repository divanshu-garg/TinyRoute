import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { useState } from "react";
import { getAllUserUrls } from "../api/user.api";

const AnalyticsUrlsList = () => {
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

  // console.log("urls:", urls)

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
    <div className="space-y-3 mt-25">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your URLs</h2>
      <p className="text-gray-600">
        Click on any URL below to view detailed analytics and performance
        metrics
      </p>
      {urls.urls
        .sort((a, b) => b.clicks - a.clicks)
        .map((url, index) => (
          <div
            key={url._id}
            onClick={() =>
              navigate({
                to: "/analytics/$urlId",
                params: {
                  urlId: url._id,
                },
                state: {
                  longUrl: url.full_url,
                  shortUrl: `http://localhost:3000/${url.short_url}`,
                },
              })
            }
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-500 font-medium truncate">
                    {index + 1} {`) http://localhost:3000/${url.short_url}`}
                  </span>
                  {url.clicks !== undefined && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {url.clicks} clicks
                    </span>
                  )}
                  {!url.isActive && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                      inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {url.originalUrl || url.longUrl}
                </p>
                {url.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(url.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnalyticsUrlsList;
