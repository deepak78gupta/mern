// server/src/models/User.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: String,
});

export default  User = model('User', userSchema);