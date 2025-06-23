import { useEffect, useState } from 'react';
import { wishlistApi } from '@/api/wishlistApi';
import type { Listing } from '@/types/listing';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components';
import { BookmarkMinus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await wishlistApi.getUserWishlist();
        setListings(res.data || []);
      } catch {
        toast.error('Failed to fetch wishlist.');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (listingId: string) => {
    setRemoving(listingId);
    try {
      await wishlistApi.removeFromWishlist(listingId);
      setListings((prev) => prev.filter((l) => l._id !== listingId));
      toast.success('Removed from wishlist.');
    } catch {
      toast.error('Failed to remove listing.');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-gray-500">
        Please login to view your wishlist.
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">
          Your Wishlist
        </h2>
        <p className="text-muted-foreground mt-2">
          Saved stays curated just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className={cn(
              'relative backdrop-blur-lg rounded-xl border border-white/10 shadow-xl bg-white/30 dark:bg-zinc-900/50',
              'hover:scale-[1.02] transition-transform duration-300 ease-out group overflow-hidden cursor-pointer'
            )}
            onClick={() => navigate(`/listings/${listing._id}`)}
          >
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-52 object-cover transition-transform group-hover:scale-105"
            />
            <div className="p-5 space-y-2 text-sm text-gray-800 dark:text-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-[15px] md:text-[13px] font-semibold">
                  {listing.title}
                </h2>
                <span className="bg-pri/10 text-pri text-xs font-medium px-2 py-1 rounded-full">
                  Saved by you
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {listing.description}
              </p>
              <p className="text-xs text-zinc-500">{listing.location}</p>

              <div className="flex justify-between items-center pt-4">
                <span className="text-base font-medium text-acc">
                  ₹{listing.price}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(listing._id)}
                  disabled={removing === listing._id}
                  className="gap-1 px-2 py-1 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <BookmarkMinus className="w-4 h-4 text-red-500" />
                  {removing === listing._id ? <Spinner /> : 'Remove'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
