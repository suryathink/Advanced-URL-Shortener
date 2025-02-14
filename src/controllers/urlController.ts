import { Request, Response } from "express";
import ShortUrl from "../models/ShortUrl";
import shortid from "shortid";

export const createShortUrl = async (req: Request, res: Response) => {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user.id;

    let shortCode = customAlias ? customAlias : shortid.generate();

    const newUrl = new ShortUrl({
        longUrl,
        shortCode,
        userId,
        topic
    });

    await newUrl.save();

    res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
};
