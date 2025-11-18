import mongoose from "mongoose";
import { getClicksByBrowser, getClicksByDeviceType, getClicksByReferrers, getClicksChartByDays, getClicksThisWeek, getClicksToday, getTopCountriesByClicks, getTotalClicks, getTotalUrls, getUniqueVisitors } from "../analytics/analytics.handlers.js";
import shortUrl from "../models/shortUrl.model.js";
import { handleZeroClickDays, handleZeroDeviceClicks } from "../utils/helper.js";
import { asyncHandler } from "../utils/tryCatchWrapper.js";


export const getAnalyticsData = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    
    // F1: clicks time series data
    const clicksChartData7Days = handleZeroClickDays(await getClicksChartByDays({user:userId}, 7), 7);
    const clicksChartData30Days = handleZeroClickDays(await getClicksChartByDays({user:userId}, 30), 30);
    const clicksChartData90Days = handleZeroClickDays(await getClicksChartByDays({user:userId}, 90), 90);
    
    // F2(a): clicks by device type -pie chart
    const clicksByDeviceType = handleZeroDeviceClicks(await getClicksByDeviceType({user:userId}));
    // F2(b): clicks by browser -bar chart(data sorted)
    const clicksByBrowser = await getClicksByBrowser({user:userId});

    // F3: Top Countries by Clicks -bar chart(keep data sorted)
    const clicksByCountry = await getTopCountriesByClicks({user:userId}, 6);

    // F4: dashboard overview cards
    const totalClicks = await getTotalClicks({user:userId});
    const totalUrls = await getTotalUrls({user:userId});
    const totalUniqueVisitors = await getUniqueVisitors({user:userId});
    const totalClicksToday = await getClicksToday({user:userId});
    const totalClicksThisWeek = await getClicksThisWeek({user:userId})
    
    // F5: referrer breakdown
    const totalClicksByReferrers = await getClicksByReferrers({user:userId}, 6);
    
    // F6: per url analytics


    res.status(200).json({
        success:true,
        data:{message:"Analytics Data Fetched Successfully",data:{
            totalClicks,
            totalUrls,
            totalUniqueVisitors,
            totalClicksToday,
            totalClicksThisWeek,
            totalClicksByReferrers,
            clicksByCountry,
            clicksByBrowser,
            clicksByDeviceType,
            clicksChartData7Days,
            clicksChartData30Days,
            clicksChartData90Days,
        }}});
})

export const getAnalyticsDataByUrl = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const urlId = req.params?.url_id;
    const urlObj = await shortUrl.findOne({_id:urlId});
    if(!urlObj){
        return res.status(404).json({success:false, message:"URL not found"});
    }
    if(urlObj.user.toString() !== userId.toString()){
        return  res.status(403).json({success:false, message:"you are unauthorized to access this URL analytics"});
    }
    // filter did not work with url id directly, needed to manually convert to mongoose object id here instead
    const filter = {short_url_id: new mongoose.Types.ObjectId(urlId)};

    // F1: clicks time series data
    const clicksChartData7Days = handleZeroClickDays(await getClicksChartByDays(filter, 7), 7);
    const clicksChartData30Days = handleZeroClickDays(await getClicksChartByDays(filter, 30), 30);
    const clicksChartData90Days = handleZeroClickDays(await getClicksChartByDays(filter, 90), 90);
    
    // F2(a): clicks by device type -pie chart
    const clicksByDeviceType = handleZeroDeviceClicks(await getClicksByDeviceType(filter));
    // F2(b): clicks by browser -bar chart(data sorted)
    const clicksByBrowser = await getClicksByBrowser(filter);

    // F3: Top Countries by Clicks -bar chart(keep data sorted)
    const clicksByCountry = await getTopCountriesByClicks(filter, 6);

    // F4: dashboard overview cards
    const totalClicks = await getTotalClicks({_id:urlId});
    const totalUniqueVisitors = await getUniqueVisitors(filter);
    const totalClicksToday = await getClicksToday(filter);
    const totalClicksThisWeek = await getClicksThisWeek(filter);
    
    // F5: referrer breakdown
    const totalClicksByReferrers = await getClicksByReferrers(filter, 6);
    
    // F6: per url analytics


    res.status(200).json({
        success:true,
        data:{message:"Analytics Data Fetched Successfully",data:{
            totalClicks,
            totalUniqueVisitors,
            totalClicksToday,
            totalClicksThisWeek,
            totalClicksByReferrers,
            clicksByCountry,
            clicksByBrowser,
            clicksByDeviceType,
            clicksChartData7Days,
            clicksChartData30Days,
            clicksChartData90Days,
        }}});
})