import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
}, { minimize: false }) //Mongoose in general skips {} as undefined and doesn't initialise cartData to {} by default, hence to stop that, we put minimise (property of mongoose to minimise or neglect {} as undefined) to false

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel