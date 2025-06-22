import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  listings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one wishlist per user
    },
    listings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
export default Wishlist;
