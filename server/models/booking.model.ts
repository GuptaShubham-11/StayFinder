import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  user: Types.ObjectId;
  listingId: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Listing reference is required'],
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
      validate: {
        validator: function (value: Date) {
          return value >= new Date();
        },
        message: 'Check-in date must be in the future',
      },
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value > this.checkIn;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Index for faster queries by user or listing
bookingSchema.index({ user: 1 });
bookingSchema.index({ listingId: 1 });

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
