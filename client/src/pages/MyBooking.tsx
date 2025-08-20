import { useEffect, useState } from 'react';
import { bookingApi } from '@/api/bookingApi';
import { Spinner } from '@/components';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

type BookingItem = {
  _id: string;
  checkIn: string;
  checkOut: string;
  listingId: {
    _id: string;
    title: string;
    location: string;
    images: string[];
    price: number;
  };
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingApi.getUserBookings();
        setBookings(res.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch your bookings');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  if (loading)
    return (
      <div className="p-10 text-center">
        <Spinner />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">
          Your Bookings
        </h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Check out your recent bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <p className="text-center text-muted-foreground text-base">
          You haven’t booked anything yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Link
              to={`/listings/${booking.listingId._id}`}
              key={booking._id}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white focus:outline-none focus:ring-2 focus:ring-pri"
            >
              <img
                src={booking.listingId.images?.[0] || '/placeholder.jpg'}
                alt={booking.listingId.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-base sm:text-lg leading-snug line-clamp-2">
                  {booking.listingId.title}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {booking.listingId.location}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {new Date(booking.checkIn).toLocaleDateString()} &rarr;{' '}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold text-acc">Per Day: ₹{booking.listingId.price}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
