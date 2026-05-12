import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteUserUrl, getAllUserUrls } from "../api/user.api";
import { generateQr } from "../api/qr.api.js";
import { useSelector } from "react-redux";
import { queryClient } from "../main";
import QrPopup from "./QrPopup.jsx";
import { useNavigate } from "@tanstack/react-router";

const statusLabel = (url) => {
  if (url.isActive) return { text: "Active", dot: "bg-accent" };
  const map = {
    expired: { text: "Expired", dot: "bg-text-muted" },
    max_clicks_reached: {
      text: `Limit (${url.maxClicks})`,
      dot: "bg-danger",
    },
  };
  return (
    map[url.deactivationReason] ?? { text: "Disabled", dot: "bg-text-faint" }
  );
};

const CopyIcon = ({ className = "size-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7h8m-8 4h8m-8 4h6m2 5H6a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v12a2 2 0 01-2 2z"
    />
  </svg>
);

const TrashIcon = ({ className = "size-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 7h12M9 7V4h6v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
    />
  </svg>
);

const EyeIcon = ({ className = "size-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChartIcon = ({ className = "size-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.5l5-5 4 4 6-6M17 7h4v4"
    />
  </svg>
);

const QrAddIcon = ({ className = "size-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm13 2h2m2 0h2m-4-4v2m0 4v2"
    />
  </svg>
);

const ActionBtn = ({
  onClick,
  disabled,
  icon: Icon,
  text,
  active,
  danger,
  className = "",
}) => {
  let baseStyles =
    "text-text-muted border-transparent hover:text-text-primary hover:bg-text-primary/[0.06] hover:border-text-primary/10";

  if (active) {
    baseStyles = "text-accent border-accent/30 bg-accent/10";
  } else if (danger) {
    baseStyles =
      "text-text-muted border-transparent hover:text-danger hover:bg-danger/[0.06] hover:border-danger/40";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${baseStyles} ${className}`}
    >
      <Icon className="size-3.5 shrink-0" />
      <span>{text}</span>
    </button>
  );
};

const UserUrls = () => {
  const { user } = useSelector((s) => s.auth);
  const [copiedId, setCopiedId] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");
  const [popup, setPopup] = useState(null);
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

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (url) => {
    try {
      const deleted = await deleteUserUrl(url._id, user._id);
      if (deleted) queryClient.invalidateQueries(["userUrls"]);
    } catch (err) {
      console.error("delete failed", err);
    }
  };

  const handleGenerateQr = async (shortUrl) => {
    setQrError("");
    setQrLoading(true);
    try {
      const res = await generateQr(shortUrl);
      if (res?.qr_code_link)
        queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    } catch (err) {
      setQrError(err.response?.data?.message ?? "QR generation failed.");
    } finally {
      setQrLoading(false);
    }
  };

  const goAnalytics = (url) =>
    navigate({
      to: "/analytics/$urlId",
      params: { urlId: url._id },
      state: {
        longUrl: url.full_url,
        shortUrl: `${import.meta.env.VITE_BACKEND_URI}/${url.short_url}`,
      },
    });

  const fullShortUrl = (slug) => `${import.meta.env.VITE_BACKEND_URI}/${slug}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-text-faint text-sm">
        <div className="size-4 border border-border border-t-accent rounded-full animate-spin" />
        Loading…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 m-4 px-3 py-2 rounded-md bg-danger-bg border border-danger/50 text-danger text-xs">
        <span className="size-1.5 rounded-full bg-danger shrink-0" />
        {error.message}
      </div>
    );
  }

  if (!urls?.urls?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-faint">
        <svg
          className="size-8 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
          />
        </svg>
        <p className="text-sm font-medium text-text-muted">No links yet</p>
        <p className="text-xs mt-1">Shorten a URL above to get started.</p>
      </div>
    );
  }

  const sorted = [...urls.urls].reverse();

  return (
    <>
      {popup && (
        <QrPopup
          showQr
          setShowQr={() => setPopup(null)}
          qrUrl={popup.qrUrl}
          shortUrl={popup.shortUrl}
        />
      )}

      {qrError && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 rounded-md bg-danger-bg border border-danger/50 text-danger text-xs">
          <span className="size-1.5 rounded-full bg-danger shrink-0" />
          {qrError}
        </div>
      )}

      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border-sub">
              {["Original", "Short URL", "Status", "Clicks", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium text-text-faint uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-sub">
            {sorted.map((url) => {
              const status = statusLabel(url);
              const full = fullShortUrl(url.short_url);
              const isCopied = copiedId === url._id;

              return (
                <tr
                  key={url._id}
                  className="group hover:bg-text-primary/2 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span
                      className="text-text-muted block truncate max-w-40"
                      title={url.full_url}
                    >
                      {url.full_url}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <a
                      href={full}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-hover font-mono block truncate max-w-40 transition-colors"
                      title={full}
                    >
                      {full}
                    </a>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${status.dot}`} />
                      <span className="text-xs text-text-muted whitespace-nowrap">
                        {status.text}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-text-default">
                      {url.clicks}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ActionBtn
                        onClick={() => handleCopy(full, url._id)}
                        icon={CopyIcon}
                        text={isCopied ? "Copied" : "Copy"}
                        active={isCopied}
                      />

                      {url.qr_code_link ? (
                        <ActionBtn
                          onClick={() =>
                            setPopup({
                              qrUrl: url.qr_code_link,
                              shortUrl: url.short_url,
                            })
                          }
                          icon={EyeIcon}
                          text="View QR"
                        />
                      ) : (
                        <ActionBtn
                          onClick={() => handleGenerateQr(url.short_url)}
                          disabled={qrLoading}
                          icon={QrAddIcon}
                          text="Gen QR"
                        />
                      )}

                      <ActionBtn
                        onClick={() => goAnalytics(url)}
                        icon={ChartIcon}
                        text="Analytics"
                      />

                      <ActionBtn
                        onClick={() => handleDelete(url)}
                        icon={TrashIcon}
                        text="Delete"
                        danger
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-border-sub">
        {sorted.map((url) => {
          const status = statusLabel(url);
          const full = fullShortUrl(url.short_url);
          const isCopied = copiedId === url._id;

          return (
            <div key={url._id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-faint truncate mb-0.5">
                    {url.full_url}
                  </p>
                  <a
                    href={full}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-accent hover:text-accent-hover block truncate transition-colors"
                  >
                    {full}
                  </a>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-text-primary">
                    {url.clicks} clicks
                  </span>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <span className={`size-1.5 rounded-full ${status.dot}`} />
                    <span className="text-xs text-text-muted">
                      {status.text}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-1 pt-3 border-t border-border-sub grid grid-cols-2 sm:grid-cols-4 gap-2">
                <ActionBtn
                  onClick={() => handleCopy(full, url._id)}
                  icon={CopyIcon}
                  text={isCopied ? "Copied!" : "Copy"}
                  active={isCopied}
                  className="justify-center bg-border-sub/40 border-border"
                />

                {url.qr_code_link ? (
                  <ActionBtn
                    onClick={() =>
                      setPopup({
                        qrUrl: url.qr_code_link,
                        shortUrl: url.short_url,
                      })
                    }
                    icon={EyeIcon}
                    text="View QR"
                    className="justify-center bg-border-sub/40 border-border"
                  />
                ) : (
                  <ActionBtn
                    onClick={() => handleGenerateQr(url.short_url)}
                    disabled={qrLoading}
                    icon={QrAddIcon}
                    text="Gen QR"
                    className="justify-center bg-border-sub/40 border-border"
                  />
                )}

                <ActionBtn
                  onClick={() => goAnalytics(url)}
                  icon={ChartIcon}
                  text="Analytics"
                  className="justify-center bg-border-sub/40 border-border"
                />

                <ActionBtn
                  onClick={() => handleDelete(url)}
                  icon={TrashIcon}
                  text="Delete"
                  danger
                  className="justify-center bg-border-sub/40 border-border"
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserUrls;
