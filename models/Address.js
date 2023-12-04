import  { Schema, model, models } from "mongoose";

const AddressSchema = new Schema({
    userEmail: {type:String, unique:true, required:true}, 
    name: String,
    email: String,
    phoneNumber: String,
    address: String,
})

export const Address = models?.Address || model('Address', AddressSchema)