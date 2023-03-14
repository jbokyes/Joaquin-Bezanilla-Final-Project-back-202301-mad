import { Food } from './food';

export type User = {
  id: string;
  email: string;
  passwd: string;
  name: string;
  lastName: string;
  addFoods: Food[];
};
