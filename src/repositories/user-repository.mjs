import User from '../model/user.mjs';

export default class UserMongoRepository {

    async getAll() {
        return User.find({});
    }

    async getById(id) {
        return User.findById(id);
    }
    async getByName(name) {
        return User.find({ name });
    }
    async getByName(name) {
        return User.find({ name });
    }
    async createOne(data) {
        try {
            const newUser = new User(data);
            const userSave = await newUser.save();
            return userSave;
        } catch (err) {
            throw new Error('Error creating user: ' + err.message);
        }
    }

    async updateById(id, data) {
        try {
            await User.findByIdAndUpdate(id, data);
        } catch (err) {
            throw new Error('Error updating user: ' + err.message);
        }
    }
    async deleteById(id) {
        try {
            await User.findByIdAndDelete(id);
        } catch (err) {
            throw new Error('Error deleting user: ' + err.message);
        }
    }

    async getByEmail(email) {
        return User.findOne({ email });
    }

}