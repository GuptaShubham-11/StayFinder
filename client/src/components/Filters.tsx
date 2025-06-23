import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import { listingsFilterValidation } from '@/schemas/listingFillterValidation';

type FilterValues = {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
};

export const Filters = ({ onApply }: { onApply: (filters: any) => void }) => {
  const [filters, setFilters] = useState<FilterValues>({
    location: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    dateRange: { from: undefined, to: undefined },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { from: range.from, to: range.to },
    }));
  };

  const buildPayload = () => {
    const payload: any = {};
    const { location, minPrice, maxPrice, search, dateRange } = filters;

    if (location?.trim()) payload.location = location.trim();
    if (minPrice?.trim()) payload.minPrice = minPrice.trim();
    if (maxPrice?.trim()) payload.maxPrice = maxPrice.trim();
    if (search?.trim()) payload.search = search.trim();
    if (dateRange?.from && dateRange?.to) {
      payload.startDate = dateRange.from.toISOString();
      payload.endDate = dateRange.to.toISOString();
    }

    return payload;
  };

  const hasActiveFilters = () => {
    const { location, minPrice, maxPrice, search, dateRange } = filters;
    return (
      !!location?.trim() ||
      !!minPrice?.trim() ||
      !!maxPrice?.trim() ||
      !!search?.trim() ||
      (dateRange?.from && dateRange?.to)
    );
  };

  const handleApply = () => {
    const payload = buildPayload();
    const result = listingsFilterValidation.safeParse(payload);

    if (!hasActiveFilters()) {
      onApply({});
      return;
    }

    if (result.success) {
      onApply(payload);
    } else {
      console.error('Invalid filter input:', result.error.flatten());
    }
  };

  const handleClear = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      dateRange: { from: undefined, to: undefined },
    });
    onApply({});
  };

  return (
    <div className="p-4 pt-0 space-y-6 text-txt">
      {/* Location */}
      <div className="space-y-1">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="Enter city"
          value={filters.location}
          onChange={handleChange}
        />
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            name="minPrice"
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            name="maxPrice"
            type="number"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Keyword */}
      <div className="space-y-1">
        <Label htmlFor="search">Keyword</Label>
        <Input
          id="search"
          name="search"
          placeholder="Title or description"
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      {/* Date Range */}
      <div className="space-y-1">
        <Label>Date Range</Label>
        <DateRangePicker
          value={filters.dateRange ?? { from: undefined, to: undefined }}
          onChange={handleDateChange}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          className="flex-1 bg-pri text-white hover:bg-pri/90"
          onClick={handleApply}
        >
          Apply
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
