import { z } from 'zod';

export const availabilityValidation = z
  .object({
    start: z.coerce.date({
      required_error: 'Start date is required',
      invalid_type_error: 'Start must be a valid date',
    }),
    end: z.coerce.date({
      required_error: 'End date is required',
      invalid_type_error: 'End must be a valid date',
    }),
  })
  .refine((data) => data.end > data.start, {
    message: 'End date must be after start date',
    path: ['end'],
  });

export const listingValidation = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  location: z.string().trim().min(2, 'Location is required'),
  host: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Host must be a valid MongoDB ObjectId'),
  availability: z
    .array(availabilityValidation)
    .nonempty('At least one availability range is required'),
});

export type CreateListingInput = z.infer<typeof listingValidation>;
