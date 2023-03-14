import { Food } from '../entities/food';
import { FoodModel } from './food.mongo.model';
import { FoodMongoRepo } from './food.mongo.repo';

jest.mock('./food.mongo.model.js');

describe('Given the repository FoodMongoRepo', () => {
  const repo = new FoodMongoRepo();

  const mockPopulateFunction = (mockPopulateValue: unknown) => ({
    exec: jest.fn().mockResolvedValue(mockPopulateValue),
  });

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of GuitarsMongoRepo', () => {
      expect(repo).toBeInstanceOf(FoodMongoRepo);
    });
  });
  describe('When the read method is used', () => {
    test('Then it should return the mock result of the guitars', async () => {
      const mockPopulateValue = [{ id: '1' }, { id: '2' }];
      (FoodModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      const result = await repo.queryAll();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });
  describe('When the readId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { id: '10' };

      (FoodModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.queryId('10');
      expect(FoodModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '10' });
    });
    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (FoodModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });
  describe('When the create method is used', () => {
    test('Then if there is a mock object to create, it should return the created object', async () => {
      (FoodModel.create as jest.Mock).mockResolvedValue({
        region: 'test',
      });

      const result = await repo.create({ region: 'test' });
      expect(result).toEqual({ region: 'test' });
    });
  });
  describe('When the update method is used', () => {
    const mockFood = {
      region: 'test',
    } as Partial<Food>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { region: 'test' };

      (FoodModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.update(mockFood);
      expect(result).toEqual({ region: 'test' });
    });
    test('Then if the findByIdAndUpdate method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (FoodModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.update(mockFood)).rejects.toThrow();
    });
  });
  describe('When the erase method is used', () => {
    test('Then if it has an object to erase with its ID, the findByIdAndDelete function should be called', async () => {
      const mockPopulateValue = {};
      (FoodModel.findByIdAndDelete as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      await repo.delete('1');
      expect(FoodModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (FoodModel.findByIdAndDelete as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      expect(async () => repo.delete('')).rejects.toThrow();
    });
  });

  describe('When the search method is used', () => {
    test('Then if it has an mock query object, it should return find resolved value', async () => {
      const mockPopulateValue = [{ id: '1' }];

      (FoodModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const mockQuery = { key: 'test', value: 'test' };
      const result = await repo.search(mockQuery);
      expect(result).toEqual([{ id: '1' }]);
    });
  });
});
