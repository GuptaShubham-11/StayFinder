import mongoose, { Document, Schema, model } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[]; // URLs or filenames
  host: mongoose.Types.ObjectId; // User reference
  availability: {
    start: Date;
    end: Date;
  }[];
}

const ListingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    availability: [
      {
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model<IListing>('Listing', ListingSchema);

export default Listing;
