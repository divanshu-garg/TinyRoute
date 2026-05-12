import { useQuery } from "@tanstack/react-query";
import { getUrlAnalytics } from "../api/analytics.api";
import AnalyticsCards from "../components/AnalyticsCards";
import DeviceChart from "../components/DeviceChart";
import BarChartAnalytics from "../components/BarChartAnalytics";
import LineChartClicks from "../components/LineChartClicks";
import { useLocation, useParams, Link } from "@tanstack/react-router";

const PerUrlAnalytics = () => {
  const { urlId } = useParams({ from: "/analytics/$urlId" });
  const location = useLocation();
  const longUrl = location.state?.longUrl;
  const shortUrl = location.state?.shortUrl;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analyticsData", urlId],
    queryFn: () => getUrlAnalytics(urlId),
    enabled: !!urlId,
    refetchInterval: 1000 * 30,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center gap-3">
        <div className="size-5 border-2 border-border border-t-accent rounded-full animate-spin" />
        <span className="text-sm font-mono text-text-faint animate-pulse">
          Inspecting route data...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-base p-6 flex justify-center items-center">
        <div className="bg-danger-bg border border-danger/30 text-danger px-4 py-3 rounded-md text-sm font-mono">
          [ERR] Failed to load route analytics: {error.message}
        </div>
      </div>
    );
  }

  const metrics = data.data;

  // Parse Browser Data safely
  let browsers = ["Chrome", "Safari", "Firefox", "Edge", "Opera", "Other"];
  let browsersData = [];
  for (let b in browsers) {
    browsersData.push({
      _id: browsers[b],
      clicks:
        metrics.clicksByBrowser.find(
          (item) => item._id.toLowerCase() === browsers[b].toLowerCase(),
        )?.clicks || 0,
    });
  }

  // Parse Country Data
  let countriesData = [];
  metrics.clicksByCountry.map((item) =>
    countriesData.push({ _id: item.country, clicks: item.clicks }),
  );

  return (
    <div className="min-h-screen bg-base relative pb-24">
      {/* Texture Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Navigation */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            <svg
              className="size-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-sans font-semibold text-text-primary tracking-tight">
            Node Inspection
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Detailed telemetry for specific route
          </p>
        </div>

        {/* URL Target Information Card */}
        <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />

          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="size-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <label className="text-[10px] font-mono text-text-faint uppercase tracking-wider">
                  Active Short Route
                </label>
              </div>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg sm:text-xl font-mono font-medium text-accent hover:text-accent-hover truncate block transition-colors w-fit"
              >
                {shortUrl}
              </a>
            </div>

            <div>
              <label className="text-[10px] font-mono text-text-faint uppercase tracking-wider mb-1 block">
                Destination Target
              </label>
              <p className="text-sm text-text-muted truncate max-w-3xl">
                {longUrl}
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards (No Total URLs shown here) */}
        <AnalyticsCards showTotalUrls={false} metrics={metrics} />

        {/* Row 1: Device & Browser */}
        <div className="grid grid-cols-1 mt-10 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-5 sm:p-6 hover:border-border-sub transition-colors">
            <h2 className="text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">
              Device Matrix
            </h2>
            <div className="h-72 flex justify-center">
              <DeviceChart data={metrics.clicksByDeviceType} />
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border p-5 sm:p-6 hover:border-border-sub transition-colors">
            <h2 className="text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">
              Browser Distribution
            </h2>
            <div className="h-72">
              <BarChartAnalytics data={browsersData} />
            </div>
          </div>
        </div>

        {/* Row 2: Countries & 7 Days */}
        <div className="grid grid-cols-1 mt-6 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-5 sm:p-6 hover:border-border-sub transition-colors overflow-hidden">
            <h2 className="text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">
              Geographic Heatmap
            </h2>
            <div className="h-72 overflow-x-auto">
              <BarChartAnalytics data={countriesData} />
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border p-5 sm:p-6 hover:border-border-sub transition-colors">
            <h2 className="text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">
              7-Day Trajectory
            </h2>
            <div className="h-72 w-full">
              {/* Blue line */}
              <LineChartClicks
                data={metrics.clicksChartData7Days}
                color="#3b82f6"
              />
            </div>
          </div>
        </div>

        {/* Row 3: 30 Days Full Width */}
        <div className="bg-surface rounded-xl mt-6 shadow-sm border border-border p-5 sm:p-6 hover:border-border-sub transition-colors">
          <h2 className="text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">
            30-Day Trajectory
          </h2>
          <div className="h-80 w-full pt-4">
            {/* Purple line */}
            <LineChartClicks
              data={metrics.clicksChartData30Days}
              color="#8b5cf6"
            />
          </div>
        </div>

        {/* Row 4: 90 Days Full Width */}
        <div className="bg-surface rounded-xl mt-6 shadow-sm border border-border p-5 sm:p-6 hover:border-border-sub transition-colors">
          <h2 className="text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">
            90-Day Trajectory
          </h2>
          <div className="h-80 w-full pt-4">
            {/* Emerald line */}
            <LineChartClicks
              data={metrics.clicksChartData90Days}
              color="#10b981"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerUrlAnalytics;
