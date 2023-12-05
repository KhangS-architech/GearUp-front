import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    userEmail: String,
    line_items: Object,
    name: {type: String, required:true},
    email: {type: String, required:true},
    phoneNumber: {type: String, required:true},
    address: {type: String, required:true},
    paid: Boolean,
}, {
    timestamps: true,
})

export const Order = models?.Order || model('Order', OrderSchema)
