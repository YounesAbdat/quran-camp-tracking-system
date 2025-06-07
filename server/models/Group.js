import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [50, 'Group name cannot exceed 50 characters']
  },
  arabicName: {
    type: String,
    trim: true
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp',
    required: [true, 'Camp reference is required']
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Supervisor is required']
  },
  assistantSupervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  maxCapacity: {
    type: Number,
    default: 20,
    min: [5, 'Group must have at least 5 students capacity'],
    max: [30, 'Group cannot exceed 30 students']
  },
  ageRange: {
    min: { type: Number, default: 8 },
    max: { type: Number, default: 18 }
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  schedule: {
    startTime: String,
    endTime: String,
    breakTime: String
  },
  room: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

groupSchema.virtual('currentCapacity').get(function() {
  return this.students.length;
});

groupSchema.virtual('isFullyBooked').get(function() {
  return this.students.length >= this.maxCapacity;
});

export default mongoose.model('Group', groupSchema);
