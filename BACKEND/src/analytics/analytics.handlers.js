import Click from "../models/clicks.model.js";
import shortUrl from "../models/shortUrl.model.js";

export const getTotalClicks = async (userId) => {
  const urls = await shortUrl.find({ user: userId });
  let count = 0;
  urls.map((url) => (count += url.clicks));
  return count;
};

export const getTotalUrls = async (userId) => {
  const totalUrls = await shortUrl.countDocuments({ user: userId });
  return totalUrls;
};

export const getClicksToday = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = await Click.countDocuments({
    user: userId,
    timestamp: { $gte: today },
  });
  return count;
};

export const getClicksThisWeek = async (userId) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const count = await Click.countDocuments({
    user: userId,
    timestamp: { $gte: lastWeek },
  });
  return count;
};

export const getUniqueVisitors = async (userId) => {
  const unique = await Click.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: { _id: "$ip_address" },
    },
    {
      $count: "totalCount",
    },
  ]);
  return unique[0]?.totalCount || 0;
};

export const getClicksChartByDays = async (userId, days) => {
  const startingDate = new Date();
  startingDate.setDate(startingDate.getDate() - days);

  // clicks by user in last given days
  const clicks = await Click.aggregate([
    { $match: { user: userId, timestamp: { $gte: startingDate } } },
    {
      $set: {
        day: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$timestamp",
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

export const getClicksByDeviceType = async (userId) => {
  const clicksByDevice = await Click.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: "$device_type",
        clicks: { $sum: 1 },
      },
    },
  ]);

  return clicksByDevice;
};

export const getClicksByBrowser = async (userId) => {
  const clicksByBrowser = await Click.aggregate([
    {
      $match: {
        user: userId,
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

export const getTopCountriesByClicks = async (userId, limit = 6) => {
  const clicksByCountry = await Click.aggregate([
    {
      $match: {
        user: userId,
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

export const getClicksByReferrers = async (userId, limit=6)=>{
    const clicksByReferrers = await Click.aggregate([
        {
          $match: {
            user: userId,
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