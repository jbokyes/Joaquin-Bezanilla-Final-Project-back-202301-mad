import { Food } from '../entities/food';
import { HTTPError } from '../error/error.js';
import { Repo } from './repo.interface';
import { FoodModel } from './food.mongo.model.js';
import createDebug from 'debug';
const debug = createDebug('latino-foods:food-repo');

export class FoodMongoRepo implements Repo<Food> {
  constructor() {
    debug('foods-repo-instanced');
  }

  async queryAll(): Promise<Food[]> {
    debug('read-method');
    const data = await FoodModel.find().exec();
    return data;
  }

  async queryId(id: string): Promise<Food> {
    debug('readID-method');
    const data = await FoodModel.findById(id).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in readID');
    return data;
  }

  async create(food: Partial<Food>): Promise<Food> {
    debug('create-method');
    const data = await FoodModel.create(food);
    debug(data);
    return data;
  }

  async update(food: Partial<Food>): Promise<Food> {
    const data = await FoodModel.findByIdAndUpdate(food.id, food, {
      new: true,
    }).exec();
    debug(data);
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }

  async delete(id: string): Promise<void> {
    debug('erase-method');
    const data = await FoodModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found'
      );
  }
  async search(query: { key: string; value: unknown }) {
    debug('search-method');
    const data = await FoodModel.find({ [query.key]: query.value }).exec();
    const result = data.map((item: any) => ({
      ...item._doc,
      id: item._id.toString(),
    }));
    return result;
  }
}
