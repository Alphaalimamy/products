import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, default: 'user@gmail.com'},
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});



export default mongoose.model('User', userSchema);

