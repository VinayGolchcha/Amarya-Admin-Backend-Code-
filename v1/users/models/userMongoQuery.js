import mongoose from 'mongoose';
import {UserModel} from './userMongoModel.js';

export const create = async (user_data) => {
    try {
        return await UserModel.create(user_data);
    } catch (error) {
        console.error('Error in create query details:', error);
        throw error;
    }
}

export const updateQuery = async (email, password) => {
    try {
        return await UserModel.findOneAndUpdate({ email: email, is_registered: true }, { $set: { "password": password } }, { safe: true, upsert: false, new: true });
    } catch (error) {
        console.error('Error in updateQuery details:', error);
        throw error;
    }
}