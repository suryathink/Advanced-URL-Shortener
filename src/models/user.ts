import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;

