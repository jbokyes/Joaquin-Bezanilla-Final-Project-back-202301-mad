import { Food } from './food';

export type User = {
  id: string;
  email: string;
  passwd: string;
  username: string;
  lastName: string;
  addFoods: Food[];
  role?: string;
};
