import { useQuery } from "@tanstack/react-query";
import { getOverallAnalytics } from "../api/analytics.api";
import AnalyticsCards from "../components/AnalyticsCards";
import DeviceChart from "../components/DeviceChart";
import BarChartAnalytics from "../components/BarChartAnalytics";
import LineChartClicks from "../components/LineChartClicks";
import AnalyticsUrlsList from "../components/AnalyticsUrlsList";

const OverallAnalytics = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analyticsData"],
    queryFn: getOverallAnalytics,
    refetchInterval: 1000 * 30,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center gap-2 text-text-faint text-sm">
        <div className="size-4 border-2 border-border border-t-accent rounded-full animate-spin" />
        Loading analytics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-base p-6">
        <div className="bg-danger-bg border border-danger/50 text-danger p-4 rounded-md">
          Failed to load analytics: {error.message}
        </div>
      </div>
    );
  }

  const metrics = data.data;

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

  let countriesData = [];
  metrics.clicksByCountry.map((item) =>
    countriesData.push({ _id: item.country, clicks: item.clicks }),
  );

  return (
    <div className="min-h-screen bg-base p-6">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="mb-8 mt-6 text-center">
          <h1 className="text-3xl font-bold text-text-primary">
            Analytics Dashboard
          </h1>
          <p className="text-text-muted text-lg mt-2">
            Track your link performance
          </p>
        </div>

        <AnalyticsCards showTotalUrls={true} metrics={metrics} />

        {/* Row 1: Device & Browser */}
        <div className="grid grid-cols-1 mt-12 lg:grid-cols-2 gap-6 mx-2 sm:mx-10">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-6 hover:border-border-sub transition-colors">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Device breakdown
            </h2>
            <div className="h-72 flex justify-center">
              <DeviceChart data={metrics.clicksByDeviceType} />
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border p-6 hover:border-border-sub transition-colors">
            <h2 className="text-lg font-semibold text-text-primary pb-2 mb-4">
              Browser breakdown
            </h2>
            <div className="h-72">
              <BarChartAnalytics data={browsersData} />
            </div>
          </div>
        </div>

        {/* Row 2: Countries & 7 Days */}
        <div className="grid grid-cols-1 mt-6 lg:grid-cols-2 gap-6 mx-2 sm:mx-10">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-6 hover:border-border-sub transition-colors overflow-hidden">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Top countries by clicks
            </h2>
            <div className="h-72 overflow-x-auto">
              <BarChartAnalytics data={countriesData} />
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border p-6 hover:border-border-sub transition-colors">
            <h2 className="text-lg font-semibold text-text-primary pb-2 mb-4">
              Last 7 days clicks
            </h2>
            <div className="h-72">
              {/* Using a Blue line for variety */}
              <LineChartClicks
                data={metrics.clicksChartData7Days}
                color="#3b82f6"
              />
            </div>
          </div>
        </div>

        {/* Row 3: 30 Days */}
        <div className="bg-surface rounded-xl mt-6 mx-2 sm:mx-10 shadow-sm border border-border p-6 hover:border-border-sub transition-colors">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Last 30 days clicks
          </h2>
          <div className="h-80 w-full pt-4">
            {/* Using Purple line */}
            <LineChartClicks
              data={metrics.clicksChartData30Days}
              color="#8b5cf6"
            />
          </div>
        </div>

        {/* Row 4: 90 Days */}
        <div className="bg-surface rounded-xl mt-6 mx-2 sm:mx-10 shadow-sm border border-border p-6 hover:border-border-sub transition-colors">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Last 90 days clicks
          </h2>
          <div className="h-80 w-full pt-4">
            {/* Using Emerald line */}
            <LineChartClicks
              data={metrics.clicksChartData90Days}
              color="#10b981"
            />
          </div>
        </div>

        <div className="mt-12 mx-2 sm:mx-10">
          <AnalyticsUrlsList />
        </div>
      </div>
    </div>
  );
};

export default OverallAnalytics;
