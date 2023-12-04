import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    userEmail: String,
    line_items: Object,
    name: String,
    email: String,
    phoneNumber: String,
    address: String,
    paid: Boolean,
}, {
    timestamps: true,
})

export const Order = models?.Order || model('Order', OrderSchema)
