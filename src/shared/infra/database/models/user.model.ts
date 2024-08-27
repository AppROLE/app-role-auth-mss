import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IFollowing {
  user_followed_id: string;
  followed_at: Date;
}

interface IFavorite {
  institute_id: string;
  event_id: string;
  favorited_at: Date;
}

interface IReview {
  institute_id: string;
  star: number;
  review: string;
  reviewed_at: Date;
}

export interface IUser extends Document {
  _id: string;
  name: string;
  username: string;
  email: string;
  created_at: Date;
  lnk_instagram: string;
  lnk_tiktok: string;
  bg_photo: string;
  profile_photo: string;
  privacy: string;
  following: IFollowing[];
  favorites: IFavorite[];
  reviews: IReview[];
}

const FollowingSchema = new Schema<IFollowing>({
  user_followed_id: { type: String, ref: "User" },
  followed_at: { type: Date, default: Date.now },
});

const FavoriteSchema = new Schema<IFavorite>({
  institute_id: { type: String, ref: "Institute" },
  event_id: { type: String, ref: "Event" },
  favorited_at: { type: Date, default: Date.now },
});

const ReviewSchema = new Schema<IReview>({
  institute_id: { type: String, ref: "Institute" },
  star: { type: Number, required: true },
  review: { type: String, required: true },
  reviewed_at: { type: Date, default: Date.now },
});

const UserSchema: Schema = new Schema<IUser>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  lnk_instagram: { type: String },
  lnk_tiktok: { type: String },
  bg_photo: { type: String },
  profile_photo: { type: String },
  privacy: { type: String },
  following: [FollowingSchema],
  favorites: [FavoriteSchema],
  reviews: [ReviewSchema],
});

export default mongoose.model<IUser>("User", UserSchema);
