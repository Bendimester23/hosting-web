import { Schema, model } from 'mongoose';

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default model('Category', schema);