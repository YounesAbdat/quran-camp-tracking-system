import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  parent: {
    name: String,
    email: String,
    phone: String
  },
  type: {
    type: String,
    enum: ['suggestion', 'complaint', 'compliment', 'question', 'other'],
    required: [true, 'Feedback type is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp'
  }
}, {
  timestamps: true
});

export default mongoose.model('Feedback', feedbackSchema);
