const Card = ({ label, value }) => (
  <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] max-w-xs rounded-xl border border-border bg-surface p-5 shadow-sm hover:bg-white/2 transition-colors">
    <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
      {label}
    </p>
    <p className="mt-2 text-3xl font-semibold text-text-primary font-mono">
      {value?.toLocaleString() || 0}
    </p>
  </div>
);

const AnalyticsCards = ({ metrics, showTotalUrls }) => {
  return (
    <div>
      <div className="flex justify-center py-5">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 text-center">
          Overall Analytics
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8 px-2 sm:px-[10%]">
        <Card label="Total Clicks" value={metrics.totalClicks} />

        {showTotalUrls && (
          <>
            <Card label="Total URLs" value={metrics.totalUrls} />
            <Card label="Total Active URLs" value={metrics.totalActiveUrls} />
            <Card
              label="Total Inactive URLs"
              value={metrics.totalInActiveUrls}
            />
          </>
        )}

        <Card label="Unique Visitors" value={metrics.totalUniqueVisitors} />
        <Card label="Clicks Today" value={metrics.totalClicksToday} />
        <Card label="Clicks This Week" value={metrics.totalClicksThisWeek} />
      </div>
    </div>
  );
};

export default AnalyticsCards;
