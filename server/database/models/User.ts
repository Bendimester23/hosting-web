import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 6,
        max: 255,
        required: true
    },
    email: {
        type: String,
        min: 6,
        max: 255,
        required: true
    },
    password: {
        type: String,
        min: 6,
        max: 1024,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);