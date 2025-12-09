import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { byIso } from "country-code-lookup";

export const generateNanoId = (length) => nanoid(length);

export const signToken = (payload) => {
  // get only userid in payload
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
  // returns userid payload on success
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const handleDateExpiry = async (shortUrl) => {
    if (shortUrl.expiresAt && new Date() > shortUrl.expiresAt) {
    if (shortUrl.isActive) {
      shortUrl.isActive = false;
      shortUrl.deactivatedAt = new Date();
      shortUrl.deactivationReason = 'expired';
      await shortUrl.save();
    }
    return true;
  }
  return false;
}

export const handleClicksExpiry = async (shortUrl) => {
  if (shortUrl.maxClicks && shortUrl.clicks >= shortUrl.maxClicks) {
    if (shortUrl.isActive) {
      shortUrl.isActive = false;
      shortUrl.deactivatedAt = new Date();
      shortUrl.deactivationReason = 'max_clicks_reached';
      await shortUrl.save();
    }
    return true;
  }
  return false;
}

export const handleBrowserName = (browser) => {
    if(!browser) return "Other"
    const name = browser.toLowerCase();

    if (name.includes("chrome")) return "Chrome";
    if (name.includes("safari")) return "Safari";
    if (name.includes("firefox")) return "Firefox";
    if (name.includes("edge")) return "Edge";
    if (name.includes("opera")) return "Opera";

    return "Other";
}

export const getDeviceType = (type) => {
  if (type === "mobile") return "mobile";
  if (type === "tablet") return "tablet";
  // for desktop, us parser returns null, undefined or ""
  if (!type) return "desktop";

  return "unknown";
};

export const getCountryFromCode = (countryCode) => {
  if (!countryCode) return "unknown";
  const result = byIso(countryCode);
  return result?.country || "unknown";
};

// for analytics click time series chart
export const handleZeroClickDays = (arr, days) => {
  console.log("arr:", arr)
  const result = [];
  let prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - days);
  // result.push(arr[0]);
  for (let i = 0; i < arr.length; i++) {
    let currDate = new Date(arr[i]._id);
    if(i!==0) prevDate = new Date(arr[i - 1]._id);
    const daysDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

    if (daysDiff === 1) {
      result.push(arr[i]);
    } else {
      for (let j = 1; j < daysDiff; j++) {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + j);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, "0");
        const date = String(newDate.getDate()).padStart(2, "0");
        result.push({ _id: `${year}-${month}-${date}`, clicks: 0 });
      }
      result.push(arr[i]);
    }
  }

  return result;
};

export const handleZeroDeviceClicks = (arr)=>{
  let result = []
  const requiredOptions = {'desktop':true, 'mobile':true, 'tablet':true, 'unknown':true}
  const currOptions = {};
  arr.forEach(elem => currOptions[elem._id] = elem.clicks)

  for(const option in requiredOptions){
    if(currOptions[option] >0){
      result.push({_id:option, count:currOptions[option]})
    }else{
      result.push({_id:option, count:0})
    }
  }

  // console.log("result", result)
  return result;
}