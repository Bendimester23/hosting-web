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
}, {
    timestamps: true
});

export default model('Category', schema);