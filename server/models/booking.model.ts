import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    listing: mongoose.Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
}

const bookingSchema = new Schema<IBooking>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true }
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
