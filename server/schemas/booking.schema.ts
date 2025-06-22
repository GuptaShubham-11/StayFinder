import { z } from 'zod';

export const bookingValidation = z
  .object({
    listingId: z
      .string({ required_error: 'Listing ID is required' })
      .min(1, 'Listing ID cannot be empty'),

    checkIn: z.coerce.date({
      required_error: 'Check-in date is required',
      invalid_type_error: 'Invalid check-in date format',
    }),

    checkOut: z.coerce.date({
      required_error: 'Check-out date is required',
      invalid_type_error: 'Invalid check-out date format',
    }),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut'],
  });

export type CreateBookingInput = z.infer<typeof bookingValidation>;
