import mongoose from 'mongoose';

const dailyRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, default: Date.now },
  memorized: Number,
  revised: Number,
  notes: String
});

export default mongoose.model('DailyRecord', dailyRecordSchema);
