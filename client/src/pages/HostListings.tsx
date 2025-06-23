'use client';

import { useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { listingApi } from '@/api/listingApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

type HostListing = {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  availability: { start: string; end: string }[];
};

export default function HostListings() {
  const [listings, setListings] = useState<HostListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<HostListing | null>(
    null
  );
  const [editLoading, setEditLoading] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchHostListings = async () => {
    try {
      const res = await listingApi.getHostListings();
      setListings(res.data || []);
    } catch {
      toast.error('Failed to fetch your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    setDeletingId(listingId);
    try {
      await listingApi.deleteListing(listingId);
      setListings((prev) => prev.filter((l) => l._id !== listingId));
      toast.success('Listing deleted successfully');
    } catch {
      toast.error('Error deleting listing');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async () => {
    if (!editingListing) return;
    setEditLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', editingListing.title);
      formData.append('description', editingListing.description);
      formData.append('price', String(editingListing.price));
      formData.append('location', editingListing.location);
      formData.append('host', user?._id || '');
      formData.append(
        'availability',
        JSON.stringify(editingListing.availability || [])
      );

      newImageFiles.forEach((file) => formData.append('images', file));
      const remainingImages = editingListing.images.filter(
        (img) => typeof img === 'string'
      );
      formData.append('existingImages', JSON.stringify(remainingImages));

      const res = await listingApi.updateListing(editingListing._id, formData);

      setListings((prev) =>
        prev.map((l) => (l._id === editingListing._id ? res.data : l))
      );
      toast.success('Listing updated');
      setEditingListing(null);
      setNewImageFiles([]);
      setImagePreview([]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update listing');
    } finally {
      setEditLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages =
      (editingListing?.images.length || 0) +
      newImageFiles.length +
      files.length;

    if (totalImages > 5) {
      toast.error('You can upload up to 5 images.');
      return;
    }

    setNewImageFiles((prev) => [...prev, ...files]);
    setImagePreview((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleImageRemove = (index: number, isPreview: boolean) => {
    if (isPreview) {
      const updatedPreview = [...imagePreview];
      const updatedFiles = [...newImageFiles];
      updatedPreview.splice(index, 1);
      updatedFiles.splice(index, 1);
      setImagePreview(updatedPreview);
      setNewImageFiles(updatedFiles);
    } else {
      const updatedImages = [...(editingListing?.images || [])];
      updatedImages.splice(index, 1);
      setEditingListing({ ...editingListing!, images: updatedImages });
    }
  };

  useEffect(() => {
    fetchHostListings();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">
          Your Listings
        </h2>
        <p className="text-muted-foreground mt-2">Manage your listings here</p>
      </div>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          You haven’t created any listings yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="group relative border rounded-lg bg-white shadow-sm transition hover:shadow-md overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white hover:bg-gray-100"
                    onClick={() => {
                      setEditingListing(listing);
                      setImagePreview([]);
                      setNewImageFiles([]);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(listing._id)}
                    disabled={deletingId === listing._id}
                  >
                    {deletingId === listing._id ? (
                      <Spinner />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div
                className="p-4 space-y-1 cursor-pointer"
                onClick={() => navigate(`/listings/${listing._id}`)}
              >
                <h2 className="text-lg font-semibold truncate">
                  {listing.title}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {listing.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Listing Dialog */}
      <Dialog
        open={!!editingListing}
        onOpenChange={(open) => {
          if (!open) {
            setEditingListing(null);
            setImagePreview([]);
            setNewImageFiles([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>

          {editingListing && (
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={editingListing.title}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    title: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Location"
                value={editingListing.location}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    location: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Description"
                value={editingListing.description}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    description: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Price"
                type="number"
                value={editingListing.price}
                onChange={(e) =>
                  setEditingListing({
                    ...editingListing,
                    price: +e.target.value,
                  })
                }
              />

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Listing Images (max 5)
                </p>
                <div className="flex flex-wrap gap-3">
                  {editingListing.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded overflow-hidden border"
                    >
                      <img
                        src={img}
                        alt={`existing-${idx}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(idx, false)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {imagePreview.map((img, idx) => (
                    <div
                      key={`preview-${idx}`}
                      className="relative w-24 h-24 rounded overflow-hidden border"
                    >
                      <img
                        src={img}
                        alt={`preview-${idx}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(idx, true)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button className='bg-pri hover:bg-pri/90 text-white cursor-pointer' disabled={editLoading} onClick={handleUpdate}>
              {editLoading ? <Spinner /> : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
