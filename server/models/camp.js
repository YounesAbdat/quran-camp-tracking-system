import mongoose from 'mongoose';

const campSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Camp name is required'],
    trim: true,
    maxlength: [100, 'Camp name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender specification is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  maxDuration: {
    type: Number,
    default: 12,
    min: [1, 'Duration must be at least 1 day'],
    max: [30, 'Duration cannot exceed 30 days']
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  maxStudents: {
    type: Number,
    default: 100,
    min: [1, 'Must allow at least 1 student']
  },
  registrationDeadline: {
    type: Date
  },
  fees: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' }
  }
}, {
  timestamps: true
});

campSchema.virtual('duration').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

campSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

export default mongoose.model('Camp', campSchema);
