export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  availability: {
    start: string;
    end: string;
  }[];
  host: {
    _id: string;
    email: string;
    role: string;
  };
  createdAt: string;
}
