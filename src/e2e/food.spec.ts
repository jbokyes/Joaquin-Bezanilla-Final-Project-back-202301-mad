import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { dbConnect } from '../db/connect.db';
import { FoodModel } from '../repository/food.mongo.model';
import { Auth, PayloadToken } from '../helpers/auth';

const setFoodCollection = async () => {
  const foodsMock = [
    {
      name: 'choripan',
      cuisine: 'asado',
      diet: 'none',
      region: 'chile',
      info: 'muy ricos',
      img: 'link to firebase',
    },
    {
      name: 'arepas',
      cuisine: 'muchas',
      diet: 'vegetarian and vegan',
      region: 'venezuela',
      info: 'muy malas',
      img: 'link to firebase',
    },
  ];
  await FoodModel.deleteMany().exec();
  await FoodModel.insertMany(foodsMock);
  const foodData = await FoodModel.find().exec();
  const mockFoodIds = [foodData[0].id, foodData[1].id];
  return mockFoodIds;
};
describe('Given the REST Api with a /foods path and a connection with MongoDB', () => {
  beforeEach(async () => {
    await dbConnect();
    const mockUsersId = await setFoodCollection();
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });
  const userLogin = async () => {
    const loginUserMock = {
      email: 'alejandro@bezanilla',
      passwd: '12345',
    };
    const payload: PayloadToken = {
      id: '123',
      email: 'aldanaajsnsanjja',
      role: 'user',
    };
    const token = Auth.createJWT(payload);
  };
  describe('Given the GET method', () => {
    test('Then if all the information required is correct and we let region be "all" by default, the status code should be 201', async () => {
      userLogin();
      const testUrlGetFoods = `/foods`;
      const response = await request(app).get(testUrlGetFoods);
      expect(response.status).toBe(201);
    });
    test('Then if all the information required is correct and we give a specific region and an available page, the status code should be 201', async () => {
      userLogin();
      const testUrlGetFoods = `/foods?page=1&region=chile`;
      const response = await request(app).get(testUrlGetFoods);
      expect(response.status).toBe(201);
    });
  });
  describe('Given the POST method', () => {
    test('Then, asumming the user writes all the informations the food dish asks for, the response status code should be 201', async () => {
      const foodPostMock = {
        name: 'choripan1',
        cuisine: 'asado',
        diet: 'none',
        region: 'chile',
        info: 'muy ricos',
        img: 'link to firebase',
      };
      const loginUserMock = {
        email: 'alejandro@bezanilla',
        passwd: '12345',
      };
      const payload: PayloadToken = {
        id: '123',
        email: 'aldanaajsnsanjja',
        role: 'user',
      };
      const token = Auth.createJWT(payload);
      const testUrlGetFoods = `/foods/add`;
      const response = await request(app)
        .post(testUrlGetFoods)
        .set('Authorization', 'Bearer ' + token)
        .send(foodPostMock);
      expect(response.status).toBe(201);
    });
  });
});
