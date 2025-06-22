import mongoose, { Document, Schema, model } from 'mongoose';

export interface IAvailabilityRange {
  start: Date;
  end: Date;
}

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  host: mongoose.Types.ObjectId;
  availability: IAvailabilityRange[];
}

const AvailabilitySchema = new Schema<IAvailabilityRange>(
  {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IAvailabilityRange) {
          return this.end > this.start;
        },
        message: 'End date must be after start date',
      },
    },
  },
  { _id: false }
);

const ListingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive'],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.every((img) => typeof img === 'string'),
        message: 'All images must be strings (URLs or filenames)',
      },
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    availability: {
      type: [AvailabilitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Listing = model<IListing>('Listing', ListingSchema);

export default Listing;
