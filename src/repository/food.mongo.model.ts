import { Schema } from 'mongoose';
import { Food } from '../entities/food';

const foodSchema = new Schema<Food>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cuisine: {
    type: String,
  },
  diet: {
    type: String,
  },
  info: {
    type: String,
    required: true,
  },
  region: {
    type: String,
  },
  img: {
    type: String,
  },
  // Puede que falte el creador del plato
});
