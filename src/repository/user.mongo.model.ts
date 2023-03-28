import { model, Schema } from 'mongoose';
import { User } from '../entities/user.js';

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
  },
  passwd: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  addFoods: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Food',
    },
  ],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwd;
  },
});

export const UserModel = model('User', userSchema, 'users');
