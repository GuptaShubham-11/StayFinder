import { create } from 'zustand';
import type { Listing } from '@/types/listing';
import { listingApi } from '@/api/listingApi';

export type Filters = {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
};

export type SortOption = 'priceLow' | 'priceHigh';

interface ListingsStore {
  listings: Listing[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  filters: Filters;
  clearFilters: () => void;
  setFilters: (filters: Filters) => void;
  fetchListings: (reset?: boolean) => Promise<void>;
}

export const useListingsStore = create<ListingsStore>((set, get) => ({
  listings: [],
  page: 1,
  hasMore: true,
  loading: false,
  filters: {},

  clearFilters: () => set({ filters: {}, page: 1, listings: [] }),

  setFilters: (filters) => set({ filters, page: 1, listings: [] }),
  fetchListings: async (reset = false) => {
    const { page, filters, listings, loading, hasMore } = get();
    if (loading || (!reset && !hasMore)) return;

    set({ loading: true });

    try {
      const params: any = {
        page: reset ? 1 : page,
        limit: 6,
        ...filters,
        startDate: filters.dateRange?.from?.toISOString(),
        endDate: filters.dateRange?.to?.toISOString(),
      };

      const res = await listingApi.getAllListings(params);

      const { listings: newListings, pagination } = res.data;

      set({
        listings: reset ? newListings : [...listings, ...newListings],
        page: reset ? 2 : page + 1,
        hasMore: pagination.hasMore,
      });
    } catch (err) {
      console.error('Failed to fetch listings', err);
    } finally {
      set({ loading: false });
    }
  },
}));
