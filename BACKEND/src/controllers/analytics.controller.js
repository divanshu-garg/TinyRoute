import { getClicksByBrowser, getClicksByDeviceType, getClicksByReferrers, getClicksChartByDays, getClicksThisWeek, getClicksToday, getTopCountriesByClicks, getTotalClicks, getTotalUrls, getUniqueVisitors } from "../analytics/analytics.handlers.js";
import { handleZeroClickDays, handleZeroDeviceClicks } from "../utils/helper.js";
import { asyncHandler } from "../utils/tryCatchWrapper.js";


export const getAnalyticsData = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    
    // F1: clicks time series data
    const clicksChartData7Days = handleZeroClickDays(await getClicksChartByDays(userId, 7));
    const clicksChartData30Days = handleZeroClickDays(await getClicksChartByDays(userId, 30));
    const clicksChartData90Days = handleZeroClickDays(await getClicksChartByDays(userId, 90));
    
    // F2(a): clicks by device type -pie chart
    const clicksByDeviceType = handleZeroDeviceClicks(await getClicksByDeviceType(userId));
    // F2(b): clicks by browser -bar chart(data sorted)
    const clicksByBrowser = await getClicksByBrowser(userId);

    // F3: Top Countries by Clicks -bar chart(keep data sorted)
    const clicksByCountry = await getTopCountriesByClicks(userId, 6);

    // F4: dashboard overview cards
    const totalClicks = await getTotalClicks(userId);
    const totalUrls = await getTotalUrls(userId);
    const totalUniqueVisitors = await getUniqueVisitors(userId);
    const totalClicksToday = await getClicksToday(userId);
    const totalClicksThisWeek = await getClicksThisWeek(userId)
    
    // F5: referrer breakdown
    const totalClicksByReferrers = await getClicksByReferrers(userId, 6);
    
    // F6: per url analytics


    res.status(200).json({
        success:true,
        data:{message:"Analytics Data Fetched Successfully",}});
})