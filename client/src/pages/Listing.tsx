import { useEffect, useState } from 'react';
import { ListingCard } from '@/components/ListingCard';
import { ListingSkeleton } from '@/components/ListingSkeleton';
import { Filters } from '@/components/Filters';
import { useListingsStore } from '@/store/listingStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Listings() {
  const {
    listings,
    fetchListings,
    setFilters,
    filters,
    clearFilters,
    loading,
    hasMore,
  } = useListingsStore();

  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchListings(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (scrollBottom && hasMore && !loading) {
        fetchListings();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchListings, hasMore, loading]);

  const hasActiveFilters = Object.keys(filters || {}).length > 0;

  return (
    <div className="p-4 sm:p-6 sm:pt-0 max-w-screen-2xl mx-auto space-y-4">
      {/* Top Controls */}
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-pri hover:bg-pri/90 font-semibold"
              >
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto p-0">
              <DialogHeader className="p-4 border-b">
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>

              <Filters
                onApply={(filters) => {
                  setFilters(filters);
                  fetchListings(true);
                  setIsFilterOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

          {hasActiveFilters && (
            <Button
              variant="outline"
              className="text-sm bg-acc hover:bg-acc/90 text-white hover:text-white"
              onClick={() => {
                clearFilters();
                fetchListings(true);
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div
        className={cn(
          'grid gap-4 sm:gap-6',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            onClick={() => navigate(`/listings/${listing._id}`)}
          />
        ))}

        {loading &&
          Array.from({ length: 6 }).map((_, i) => <ListingSkeleton key={i} />)}
      </div>

      {/* Footer Messages */}
      {!hasMore && !loading && listings.length > 0 && (
        <p className="text-center text-sec">You've reached the end.</p>
      )}
      {!loading && listings.length === 0 && (
        <p className="text-center text-sec">No listings found.</p>
      )}
    </div>
  );
}
