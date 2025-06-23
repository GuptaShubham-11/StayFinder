import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Timer,
  BookmarkPlus,
  X,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { DateRangePicker } from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components';

import { toast } from 'sonner';
import { bookingApi } from '@/api/bookingApi';
import { listingApi } from '@/api/listingApi';
import { wishlistApi } from '@/api/wishlistApi';
import { useAuthStore } from '@/store/authStore';
import type { Listing } from '@/types/listing';
import type { DateRange } from 'react-day-picker';

type UnavailableRange = { from: Date; to: Date };

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailableDates, setUnavailableDates] = useState<UnavailableRange[]>([]);
  const [bookingRange, setBookingRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isBooking, setIsBooking] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      try {
        const [listingRes, bookingsRes] = await Promise.all([
          listingApi.getListingById(id!),
          bookingApi.getBookingsByListing(id!),
        ]);
        setListing(listingRes.data);
        setUnavailableDates(
          bookingsRes.data.map((b: any) => ({
            from: new Date(b.checkIn),
            to: new Date(b.checkOut),
          }))
        );
      } catch {
        toast.error('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const areDatesAvailable = (from?: Date, to?: Date): boolean => {
    if (!from || !to || !listing) return false;
    const availableFrom = new Date(listing.availability[0].start);
    const availableTo = new Date(listing.availability[0].end);
    return (
      from >= availableFrom &&
      to <= availableTo &&
      !unavailableDates.some((u) => from <= u.to && to >= u.from)
    );
  };

  const days =
    bookingRange.from && bookingRange.to
      ? Math.max(
        Math.ceil(
          (bookingRange.to.getTime() - bookingRange.from.getTime()) /
          (1000 * 60 * 60 * 24)
        )
      )
      : 0;

  const totalPrice = days * (listing?.price ?? 0);
  const canBook = areDatesAvailable(bookingRange.from, bookingRange.to);

  const handleBook = async () => {
    if (!canBook || !bookingRange.from || !bookingRange.to) return;
    setIsBooking(true);
    try {
      await bookingApi.createBooking({
        listingId: id!,
        checkIn: bookingRange.from,
        checkOut: bookingRange.to,
      });
      toast.success('Booking confirmed!');
      setBookingRange({ from: undefined, to: undefined });
      const { data } = await bookingApi.getBookingsByListing(id!);
      setUnavailableDates(
        data.map((b: any) => ({
          from: new Date(b.checkIn),
          to: new Date(b.checkOut),
        }))
      );
    } catch (err: any) {
      toast.error(err.message || 'Booking failed.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleWishlist = async () => {
    try {
      const res = await wishlistApi.addToWishlist(id!);
      if (res.statusCode < 400) toast.success('Added to wishlist');
    } catch {
      toast.error('Failed to add to wishlist');
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        <Spinner />
      </div>
    );

  if (!listing) return <p className="p-10 text-center">Listing not found.</p>;

  const { title, description, images, location, price, host, availability } = listing;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      {/* Image Preview */}
      <section>
        {images.length === 1 ? (
          <img
            src={images[0]}
            alt="Main"
            onClick={() => setPreviewImage(images[0])}
            className="rounded-md object-cover w-full h-[400px] cursor-zoom-in transition-transform hover:scale-105"
          />
        ) : (
          <Carousel className="relative w-full">
            <CarouselContent>
              {images.map((url, i) => (
                <CarouselItem key={i}>
                  <img
                    src={url}
                    alt={`Image ${i}`}
                    onClick={() => setPreviewImage(url)}
                    className="rounded-lg object-cover w-full h-[400px] cursor-pointer"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        )}
      </section>

      {/* Listing Info */}
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-base text-gray-700">{description}</p>
        <p className="text-muted-foreground">Hosted by {host.email}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />₹{price}/night
          </span>
          <span className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            {new Date(availability[0].start).toLocaleDateString()} -{' '}
            {new Date(availability[0].end).toLocaleDateString()}
          </span>
        </div>
      </section>

      {/* Booking Section */}
      <section className="border rounded-xl p-6 shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold">Choose your stay dates</h2>
        <DateRangePicker
          value={bookingRange as any}
          onChange={setBookingRange}
          disabledDates={unavailableDates}
        />
        {bookingRange.from && bookingRange.to && canBook ? (
          <p className="text-sm text-muted-foreground">
            Selected: <strong>{bookingRange.from.toLocaleDateString()}</strong> →{' '}
            <strong>{bookingRange.to.toLocaleDateString()}</strong>{' '}
            ({days} night{days > 1 ? 's' : ''})<br />
            Total Price: <strong>₹{totalPrice}</strong>
          </p>
        ) : (
          <p className="text-sm text-red-500">
            Please select a valid range between{' '}
            {new Date(availability[0].start).toLocaleDateString()} and{' '}
            {new Date(availability[0].end).toLocaleDateString()}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="w-full sm:w-1/2 bg-pri hover:bg-pri/90 text-white"
            disabled={!canBook || isBooking}
            onClick={() => (user ? handleBook() : setShowLoginDialog(true))}
          >
            {isBooking ? <Spinner /> : 'Book Now'}
          </Button>
          <Button
            variant="outline"
            onClick={handleWishlist}
            className="w-full sm:w-1/2 hover:bg-acc hover:text-white"
          >
            <BookmarkPlus className="mr-2" /> Add to Wishlist
          </Button>
        </div>
      </section>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          <p>Please login to book or add this listing to your wishlist.</p>
          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Image Zoom Preview */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-5xl bg-transparent p-0 overflow-hidden shadow-2xl">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-2 right-2 z-50 bg-white/70 backdrop-blur-lg rounded-full p-1"
          >
            <X />
          </button>
          <img
            src={previewImage!}
            alt="Preview"
            className="w-full max-h-[90vh] object-contain bg-black"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
