
const AnalyticsCards = ({metrics, showTotalUrls}) => {
  return (
    <div>
    <div className="flex justify-center py-5">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2 text-center">
            Overall Analytics
          </h1>
        </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8 px-[10%] ">
        <div className="w-full sm:w-1/2 lg:w-1/3 max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Clicks
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics.totalClicks}
          </p>
        </div>

        {showTotalUrls? <div className="w-full sm:w-1/2 lg:w-1/3 max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total URLs
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics.totalUrls}
          </p>
        </div> : null}

                {showTotalUrls? <div className="w-full sm:w-1/2 lg:w-1/3 max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Active URLs
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics.totalActiveUrls}
          </p>
        </div> : null}

                {showTotalUrls? <div className="w-full sm:w-1/2 lg:w-1/3 max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Inactive URLs
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics.totalInActiveUrls}
          </p>
        </div> : null}

        <div className="w-full sm:w-1/2 lg:w-1/3 max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Unique Visitors
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics.totalUniqueVisitors}
          </p>
        </div> 

        <div className="w-full sm:w-1/2 lg:w-1/3 max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Clicks Today
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics.totalClicksToday}
          </p>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/3 max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Clicks This Week
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics.totalClicksThisWeek}
          </p>
        </div>
      </div>
  </div>
  )
}

export default AnalyticsCards