import { z } from 'zod';

export const bookingValidation = z.object({
    listing: z.string({ required_error: 'Listing ID is required' }),
    checkIn: z.coerce.date({
        required_error: 'Check-in date is required',
        invalid_type_error: 'Invalid date format',
    }),
    checkOut: z.coerce.date({
        required_error: 'Check-out date is required',
        invalid_type_error: 'Invalid date format',
    }),
    totalPrice: z.number().min(0, 'Total price must be non-negative'),
});

export type CreateBookingInput = z.infer<typeof bookingValidation>;
