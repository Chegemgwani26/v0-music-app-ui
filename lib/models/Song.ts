import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
  _id: string;
  title: string;
  artist: string; // User ID of the artist
  description?: string;
  audioUrl: string; // URL to audio file
  coverImage?: string;
  duration: number; // in seconds
  plays: number;
  likes: string[]; // array of user IDs who liked
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      default: '',
    },
    audioUrl: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      required: true,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema);