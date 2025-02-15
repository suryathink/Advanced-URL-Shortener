import { Request, Response } from "express";
import shortid from "shortid";
import ShortUrl from "../models/shortUrl";
import { detectOS, detectDevice } from "../helpers/detector"


export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    console.log("user", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const existingUrl = await ShortUrl.findOne({ longUrl, userId });

    if (existingUrl) {
      return res.status(200).json({
        message: "URL already shortened",
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
      });
    }

    let shortCode = customAlias ? customAlias : shortid.generate();

    if (customAlias) {
      const aliasExists = await ShortUrl.findOne({ shortCode: customAlias });
      if (aliasExists) {
        return res
          .status(400)
          .json({ message: "Custom alias is already taken" });
      }
    }

    const newUrl = new ShortUrl({
      longUrl,
      shortCode,
      userId,
      topic,
    });

    await newUrl.save();

    return res
      .status(201)
      .json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUrlAnalytics = async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;

    const shortUrl = await ShortUrl.findOne({ shortCode: alias });

    if (!shortUrl) {
      res.status(404).json({ message: "Short URL not found" });
      return;
    }

    const { analytics } = shortUrl;

    const totalClicks = analytics.length;

    const uniqueUsers = new Set(
      analytics.map((entry) => `${entry.ip}-${entry.userAgent}`)
    ).size;

    const clicksByDateMap: Record<string, number> = {};
    const today = new Date();

    analytics.forEach((entry) => {
      const date = new Date(entry.timestamp).toISOString().split("T")[0]; // YYYY-MM-DD format
      if (!clicksByDateMap[date]) {
        clicksByDateMap[date] = 0;
      }
      clicksByDateMap[date]++;
    });

    const clicksByDate = Object.entries(clicksByDateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date (recent first)
      .slice(0, 7); // Last 7 days

    // OS Type Breakdown
    const osStats: Record<
      string,
      { uniqueClicks: number; uniqueUsers: Set<string> }
    > = {};
    analytics.forEach((entry) => {
      const osName = entry.os ?? "Unknown"; // Handle null/undefined values
      const userKey = `${entry.ip}-${entry.userAgent}`;

      if (!osStats[osName]) {
        osStats[osName] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }

      osStats[osName].uniqueClicks++;
      osStats[osName].uniqueUsers.add(userKey);
    });

    const osType = Object.entries(osStats).map(([osName, stats]) => ({
      osName,
      uniqueClicks: stats.uniqueClicks,
      uniqueUsers: stats.uniqueUsers.size,
    }));

    // Device Type Breakdown
    const deviceStats: Record<
      string,
      { uniqueClicks: number; uniqueUsers: Set<string> }
    > = {};
    analytics.forEach((entry) => {
      const deviceName = entry.device ?? "Unknown"; // Handle null/undefined values
      const userKey = `${entry.ip}-${entry.userAgent}`;

      if (!deviceStats[deviceName]) {
        deviceStats[deviceName] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }

      deviceStats[deviceName].uniqueClicks++;
      deviceStats[deviceName].uniqueUsers.add(userKey);
    });

    const deviceType = Object.entries(deviceStats).map(
      ([deviceName, stats]) => ({
        deviceName,
        uniqueClicks: stats.uniqueClicks,
        uniqueUsers: stats.uniqueUsers.size,
      })
    );

    return res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType,
      deviceType,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;
    const url = await ShortUrl.findOne({ shortCode: alias });
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    url.clicks += 1;

    url.analytics.push({
      ip: req.ip || req.headers["x-forwarded-for"] || "Unknown",
      userAgent: req.headers["user-agent"] || "Unknown",
      os: detectOS(req.headers["user-agent"] || ""),
      device: detectDevice(req.headers["user-agent"] || ""),
      timestamp: new Date(),
    });

    await url.save();

    res.redirect(url.longUrl);
  } catch (error) {
    console.error("Error in redirectUrl:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


