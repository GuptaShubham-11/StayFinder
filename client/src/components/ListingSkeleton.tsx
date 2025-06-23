import { Skeleton } from '@/components/ui/skeleton';

export const ListingSkeleton = () => {
  return (
    <div className="rounded-2xl border border-border bg-bg shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-[4/3]">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-4">
        {/* Title and Price */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-2/3 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      </div>
    </div>
  );
};
