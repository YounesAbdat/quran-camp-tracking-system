import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  parentContact: String
});

export default mongoose.model('Student', studentSchema);
