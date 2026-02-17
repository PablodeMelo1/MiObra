import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
});

export default mongoose.model('User', userSchema);