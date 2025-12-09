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

  if (isLoading) return <div>Loading analytics...</div>;
  if (isError) return <div>Failed to load analytics: {error.message}</div>;
  // console.log("Analytics data:", data);

  const metrics = data.data;
  let browsers = ["Chrome", "Safari", "Firefox", "Edge", "Opera", "Other"];
  let browsersData = [];
  for (let b in browsers) {
    browsersData.push({
      _id: browsers[b],
      clicks:
        metrics.clicksByBrowser.find(
          (item) => item._id.toLowerCase() === browsers[b].toLowerCase()
        )?.clicks || 0,
    });
  }

  let countriesData = [];
  metrics.clicksByCountry.map((item) =>
    countriesData.push({ _id: item.country, clicks: item.clicks })
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Track your link performance</p>
        </div>

        <AnalyticsCards showTotalUrls={true} metrics={metrics} />

        {/* grid 2 col */}
        <div className="grid grid-cols-1 mt-20 lg:grid-cols-2 gap-6 mx-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Device breakdown
            </h2>
            <DeviceChart data={metrics.clicksByDeviceType} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 pb-15 mb-4">
              Browser breakdown
            </h2>
            <BarChartAnalytics data={browsersData} />
          </div>
        </div>

        <div className="grid grid-cols-1 mt-10 lg:grid-cols-2 gap-6 mx-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-15">
              Top countries by clicks
            </h2>
            {/* <div className="flex justify-center"> */}
            <BarChartAnalytics data={countriesData} />
            {/* </div> */}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 pb-15 mb-4">
              Last 7 days clicks chart
            </h2>
            <LineChartClicks data={metrics.clicksChartData7Days} />
          </div>
        </div>

        <div className="bg-white rounded-xl mt-25 mx-10 px-15 shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold block text-gray-800 mb-4">
            Last 30 days clicks chart
          </h2>
          <div className="flex p-5 justify-center">
            <LineChartClicks data={metrics.clicksChartData30Days} />
          </div>
        </div>

        <div className="bg-white rounded-xl mt-15 mx-10 px-15 shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold block text-gray-800 mb-4">
            Last 90 days clicks chart
          </h2>
          <div className="flex p-5 justify-center">
            <LineChartClicks data={metrics.clicksChartData90Days} />
          </div>
        </div>
      <AnalyticsUrlsList/>

      </div>
    </div>
  );
};

export default OverallAnalytics;
