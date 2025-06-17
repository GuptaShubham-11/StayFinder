import { z } from 'zod';

export const availabilityValidation = z.object({
  start: z.coerce.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start must be a valid date',
  }),
  end: z.coerce.date({
    required_error: 'End date is required',
    invalid_type_error: 'End must be a valid date',
  }),
});

export const listingValidation = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be non-negative'),
  location: z.string().min(2, 'Location is required'),
  images: z.array(z.string().url()).optional().default([]),
  availability: z
    .array(availabilityValidation)
    .nonempty('At least one availability range is required'),
  host: z.string().min(1, 'Host (user ID) is required'),
});

export type CreateListingInput = z.infer<typeof listingValidation>;
