export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string; // ISO string from backend
  price: number;
  createdAt: string;
  updatedAt: string;
}
