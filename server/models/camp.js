import mongoose from 'mongoose';

const campSchema = new mongoose.Schema({
  name: String,
  location: String,
  gender: { type: String, enum: ['male', 'female'] },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

export default mongoose.model('Camp', campSchema);
