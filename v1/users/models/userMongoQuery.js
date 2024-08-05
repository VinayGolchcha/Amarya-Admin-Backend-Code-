import mongoose from 'mongoose';
import {UserModel} from './userMongoModel.js';

export const create = async (user_data) => {
    return await UserModel.create(user_data);
}
