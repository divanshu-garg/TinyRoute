import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
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
    refetchInterval: 30000,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16 gap-3">
        <div className="size-4 border-2 border-border border-t-accent rounded-full animate-spin" />
        <span className="text-sm font-mono text-text-faint">
          Loading routes...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-danger-bg border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm font-mono mt-6">
        [ERR] Failed to load URL data: {error.message}
      </div>
    );
  }

  if (!urls?.urls || urls.urls.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-16 px-4 bg-surface rounded-xl border border-border border-dashed">
        <div className="size-12 rounded-full bg-border-sub flex items-center justify-center mb-4">
          <svg
            className="size-6 text-text-faint"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-text-primary mb-1">
          No active routes
        </p>
        <p className="text-xs text-text-muted">
          You haven't created any shortened URLs yet.
        </p>
      </div>
    );
  }

  // Sort URLs by clicks (highest first)
  const sortedUrls = [...urls.urls].sort(
    (a, b) => (b.clicks || 0) - (a.clicks || 0),
  );

  // Find the absolute highest click count to calculate relative progress bars
  const maxClicks = Math.max(...sortedUrls.map((u) => u.clicks || 0), 1);

  // Format Date utility
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="mt-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Route Performance
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Select a route to view detailed analytics.
          </p>
        </div>
        <div className="text-xs font-mono text-text-faint bg-surface border border-border px-3 py-1.5 rounded-md">
          Total Routes:{" "}
          <span className="text-text-primary font-semibold">
            {sortedUrls.length}
          </span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Table Header (Hidden on small screens for cleaner mobile view) */}
        <div className="hidden sm:grid grid-cols-[48px_1fr_180px_120px_40px] items-center gap-4 px-4 py-3 border-b border-border-sub bg-base/50">
          <span className="text-[10px] font-mono uppercase text-text-faint text-center">
            Rank
          </span>
          <span className="text-[10px] font-mono uppercase text-text-faint">
            Origin / Destination
          </span>
          <span className="text-[10px] font-mono uppercase text-text-faint">
            Traffic Volume
          </span>
          <span className="text-[10px] font-mono uppercase text-text-faint text-right">
            Status & Date
          </span>
          <span />
        </div>

        {/* URL List */}
        <div className="divide-y divide-border-sub">
          {sortedUrls.map((url, index) => {
            const shortUrlFull = `${import.meta.env.VITE_BACKEND_URI}/${url.short_url}`;
            const clickRatio = ((url.clicks || 0) / maxClicks) * 100;
            const rank = (index + 1).toString().padStart(2, "0");

            return (
              <div
                key={url._id}
                onClick={() =>
                  navigate({
                    to: "/analytics/$urlId",
                    params: { urlId: url._id },
                    state: { longUrl: url.full_url, shortUrl: shortUrlFull },
                  })
                }
                className="group relative grid grid-cols-1 sm:grid-cols-[48px_1fr_180px_120px_40px] items-center gap-3 sm:gap-4 p-4 hover:bg-white/2 cursor-pointer transition-colors duration-150"
              >
                {/* 1. Rank (Mobile: hidden, Desktop: visible) */}
                <div className="hidden sm:flex justify-center">
                  <span className="font-mono text-xs font-medium text-text-faint group-hover:text-text-muted transition-colors">
                    {rank}
                  </span>
                </div>

                {/* 2. URLs */}
                <div className="min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {/* Mobile rank shows here instead */}
                    <span className="sm:hidden font-mono text-xs font-medium text-text-faint">
                      {rank}.
                    </span>
                    <span className="text-sm font-mono font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                      {shortUrlFull}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted truncate">
                    {url.full_url}
                  </span>
                </div>

                {/* 3. Traffic Volume (Bar + Number) */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-text-primary">
                        {url.clicks || 0}
                      </span>
                      <span className="text-[10px] text-text-faint uppercase">
                        clicks
                      </span>
                    </div>
                    {/* Relative Progress Bar */}
                    <div className="h-1.5 w-full bg-border-sub rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(clickRatio, 2)}%` }} // min 2% so empty bars still show a dot
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Status & Date */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 mt-2 sm:mt-0">
                  {url.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-text-muted">
                      <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-danger">
                      <span className="size-1.5 rounded-full bg-danger" />
                      Inactive
                    </span>
                  )}
                  {url.createdAt && (
                    <span className="text-[10px] text-text-faint uppercase tracking-wider">
                      {formatDate(url.createdAt)}
                    </span>
                  )}
                </div>

                {/* 5. Chevron Arrow */}
                <div className="hidden sm:flex justify-end">
                  <svg
                    className="size-4 text-text-faint group-hover:text-text-primary transform group-hover:translate-x-1 transition-all duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsUrlsList;
