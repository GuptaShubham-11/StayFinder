import type { FC } from 'react';
import type { Listing } from '@/types/listing';
import { Calendar, MapPin } from 'lucide-react';

type ListingCardProps = {
  listing: Listing;
  onClick?: () => void;
};

export const ListingCard: FC<ListingCardProps> = ({ listing, onClick }) => {
  const { title, location, images, price, availability } = listing;
  const coverImage = images?.[0] || '/fallback.jpg';

  const formatDateRange = () => {
    if (!availability?.length) return 'No availability';
    const { start, end } = availability[0];
    const startDate = new Date(start).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
    });
    const endDate = new Date(end).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
    });
    return `${startDate} - ${endDate}`;
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pri"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Price */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-txt truncate">{title}</h3>
          <div className="text-base font-bold text-acc shrink-0">₹{price}</div>
        </div>

        {/* Location & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-sec">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 shrink-0 text-sec" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-4 h-4 shrink-0 text-sec" />
            <span className="truncate">{formatDateRange()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
