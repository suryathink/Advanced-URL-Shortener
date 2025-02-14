import mongoose from "mongoose";

const ShortUrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String },
    clicks: { type: Number, default: 0 },
    analytics: [
        {
            ip: String,
            userAgent: String,
            os: String,
            device: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const ShortUrl = mongoose.model("ShortUrl", ShortUrlSchema);
export default ShortUrl;
