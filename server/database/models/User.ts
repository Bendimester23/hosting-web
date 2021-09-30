import { Schema, model, ObjectId} from 'mongoose';

const userSchema = new Schema({
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
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
        default: ``
    }
}, {
    timestamps: true
});

export type UserType = {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export default model('User', userSchema);