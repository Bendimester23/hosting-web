import { Schema, model } from 'mongoose';

const PriceSchema = new Schema({
    currency: {
        type: String,
        default: `USD`
    },
    ammount: {
        type: Number,
        default: 0
    }
})

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    notIncluded: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        default: ``
    },
    isLimitedStock: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        default: -1
    },
    price: {
        type: PriceSchema,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default model('Product', schema);