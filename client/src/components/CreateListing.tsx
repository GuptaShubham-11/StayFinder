import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  createListingValidation,
  type CreateListingInput,
} from '@/schemas/createListingValidation';
import { listingApi } from '@/api/listingApi';
import { Label } from '@/components/ui/label';
import Spinner from './Spinner';

const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

export function CreateListingForm() {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<Omit<CreateListingInput, 'images'>>({
    title: '',
    description: '',
    price: 0,
    location: '',
    availability: [],
    host: user?._id || '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImageFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleAddAvailability = () => {
    const start = new Date(availabilityStart);
    const end = new Date(availabilityEnd);
    const now = new Date();

    if (!availabilityStart || !availabilityEnd) {
      toast.error('Please provide both start and end dates.');
      return;
    }

    if (start < now || end < now) {
      toast.error('Dates must not be in the past.');
      return;
    }

    if (start > end) {
      toast.error('End date must be after start date.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { start, end }],
    }));
    setAvailabilityStart('');
    setAvailabilityEnd('');
  };

  const handleRemoveAvailability = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = createListingValidation.safeParse({
      ...formData,
      images: [],
    });

    if (!validation.success) {
      toast.error('Validation failed. Please check your input.');
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', String(formData.price));
      formDataToSend.append('location', formData.location);
      formDataToSend.append('host', formData.host);
      formDataToSend.append(
        'availability',
        JSON.stringify(formData.availability)
      );

      imageFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const res = await listingApi.createListing(formDataToSend);
      if (res.statusCode < 400) {
        toast.success('Listing created successfully!');
        setFormData({
          title: '',
          description: '',
          price: 0,
          location: '',
          availability: [],
          host: user?._id || '',
        });
        setImageFiles([]);
      }
    } catch (err: any) {
      console.log(err);

      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-8 mt-10"
    >
      <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-white">
        Create New Listing
      </h2>

      {/* Title, Location, Price */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="price">Price (Rupees per night)</Label>
          <Input
            id="price"
            type="number"
            step={2000}
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>

      {/* Upload Images */}
      <div>
        <Label>Upload Images</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          multiple
        />
        {imageFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {imageFiles.map((file, i) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <div
                  key={i}
                  className="relative group w-24 h-24 rounded overflow-hidden border"
                >
                  <img
                    src={previewUrl}
                    alt={`Preview ${i}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImageFiles((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      )
                    }
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <Label className="block mb-1 text-base font-semibold">
          Availability Dates
        </Label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="date"
            min={today}
            value={availabilityStart}
            onChange={(e) => setAvailabilityStart(e.target.value)}
          />
          <Input
            type="date"
            min={availabilityStart || today}
            value={availabilityEnd}
            onChange={(e) => setAvailabilityEnd(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleAddAvailability}
            disabled={!availabilityStart || !availabilityEnd}
            className="bg-pri text-white hover:bg-pri/90 cursor-pointer"
          >
            Add
          </Button>
        </div>

        {formData.availability.length > 0 && (
          <ul className="space-y-2 mt-3 text-sm">
            {formData.availability.map((range, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-md"
              >
                <span>
                  {new Date(range.start).toLocaleDateString()} →{' '}
                  {new Date(range.end).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAvailability(i)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pri text-white hover:bg-pri/90"
      >
        {isLoading ? <Spinner /> : 'Create Listing'}
      </Button>
    </form>
  );
}
