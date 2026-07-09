import User from '../model/user-schema.mjs';

export default class UserMongoRepository {

    async getAll() {
        return User.find({});
    }

    async getAllByIds(ids = []) {
        return User.find({ _id: { $in: ids } });
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
    async createOne(data, session = null) {
        try {
            if (session) {
                const [userSave] = await User.create([data], { session });
                return userSave;
            }
            const newUser = new User(data);
            const userSave = await newUser.save();
            return userSave;
        } catch (err) {
            throw new Error('Error creating user: ' + err.message);
        }
    }

    async updateById(id, data) {
        try {
            return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        } catch (err) {
            throw new Error('Error updating user: ' + err.message);
        }
    }
    async deleteById(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (err) {
            throw new Error('Error deleting user: ' + err.message);
        }
    }

    async getByEmail(email) {
        return User.findOne({ email: String(email).toLowerCase() });
    }

    async getByEmailVerificationTokenHash(tokenHash) {
        return User.findOne({ emailVerificationTokenHash: tokenHash });
    }

}
