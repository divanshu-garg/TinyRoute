import Click from "../models/clicks.model.js";
import shortUrl from "../models/shorturl.model.js";

export const getTotalClicks = async (filter) => {
  const urls = await shortUrl.find({ ...filter });
  let count = 0;
  urls.map((url) => (count += url.clicks));
  return count;
};

export const getTotalUrls = async (filter) => {
  const totalUrls = await shortUrl.countDocuments({ ...filter });
  return totalUrls;
};

export const getClicksToday = async (filter) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = await Click.countDocuments({
    ...filter,
    timestamp: { $gte: today },
  });
  return count;
};

export const getClicksThisWeek = async (filter) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const count = await Click.countDocuments({
    ...filter,
    timestamp: { $gte: lastWeek },
  });
  return count;
};

export const getUniqueVisitors = async (filter) => {
  const unique = await Click.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: { _id: "$ip_address" },
    },
    {
      $count: "totalCount",
    },
  ]);
  console.log("unique:", unique)
  return unique[0]?.totalCount || 0;
};

export const getTotalInActiveUrls = async (filter) =>{
  return (await shortUrl.find(filter)).length
}

export const getClicksChartByDays = async (filter, days) => {
  const startingDate = new Date();
  startingDate.setDate(startingDate.getDate() - days);
  // clicks by user in last given days
  const clicks = await Click.aggregate([
    { $match: { ...filter, timestamp: { $gte: startingDate } } },
    {
      $set: {
        day: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$timestamp",
            timezone: "Asia/Kolkata",
          },
        },
      },
    },
    { $group: { _id: "$day", clicks: { $sum: 1 } } },
    {
      $sort: { _id: 1 },
    },
  ]);
  return clicks;
};

export const getClicksByDeviceType = async (filter) => {
  const clicksByDevice = await Click.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: "$device_type",
        clicks: { $sum: 1 },
      },
    },
  ]);
  console.log("device data:", clicksByDevice);
  
  return clicksByDevice;
};

export const getClicksByBrowser = async (filter) => {
  const clicksByBrowser = await Click.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: "$browser",
        clicks: { $sum: 1 },
      },
    },
    {
      $sort: { clicks: -1 },
    },
  ]);

  return clicksByBrowser;
};

export const getTopCountriesByClicks = async (filter, limit = 6) => {
  const clicksByCountry = await Click.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
        $group:{
            _id:"$country_code",
            country:{ $first: "$country" },
            clicks:{$sum:1}
        }
    },{
        $sort: {clicks:-1}
    },
    {
        $limit: limit
    }
  ]);

  return clicksByCountry;
};

export const getClicksByReferrers = async (filter, limit=6)=>{
    const clicksByReferrers = await Click.aggregate([
        {
          $match: {
            ...filter,
          },
        },
        {
            $group:{
                _id:"$referrer",
                clicks:{$sum:1}
            }
        },{
            $sort: {clicks:-1}
        },
        {
            $limit: limit
        }
      ]);
  
      return clicksByReferrers;
}