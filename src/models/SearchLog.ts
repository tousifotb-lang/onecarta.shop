import mongoose, { Schema, Document } from "mongoose";

export interface ISearchLog extends Document {
  term: string;            // normalized (lowercase, trimmed) search term
  count: number;             // how many times this exact term has been searched
  resultsFoundCount: number; // how many of those searches actually returned products
  lastSearchedAt: Date;
}

const SearchLogSchema = new Schema<ISearchLog>(
  {
    term: { type: String, required: true, unique: true, lowercase: true, trim: true },
    count: { type: Number, default: 1 },
    resultsFoundCount: { type: Number, default: 0 },
    lastSearchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SearchLogSchema.index({ count: -1 });

export default mongoose.models.SearchLog ||
  mongoose.model<ISearchLog>("SearchLog", SearchLogSchema);