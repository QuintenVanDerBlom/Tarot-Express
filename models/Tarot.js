import mongoose from "mongoose";

const TarotSchema = new mongoose.Schema({
    title: { type: String, required: true },
    arcana: { type: String, required: true },
    suit: { type: String, required: false, default: null },
    number: { type: Number, required: false, default: null },
    description: { type: String, required: true },
    image_url: { type: String, required: false },
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            ret._links = {
                self: {
                    href: `http://145.24.223.42:8001/tarots/${ret.id}`
                },
                collection: {
                    href: `http://145.24.223.42:8001/tarots`
                }
            };
        }
    }
});

const Tarot = mongoose.model('Tarot', TarotSchema);

export default Tarot;
